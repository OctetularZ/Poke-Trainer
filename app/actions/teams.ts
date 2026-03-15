"use server"
import prisma from "@/lib/prisma"
import { PokemonBuild, Team } from "@/types/team"
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { PokemonSprites } from "@/types/pokemon"
import { fetchSprites } from "@/lib/pokeapi/helpers/fetchSprites"

export async function saveTeam(team: PokemonBuild[], teamName?: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const savedTeam = await prisma.team.create({
    data: {
      userId: session.user.id,
      name: teamName ?? null,
      members: {
        create: team.map((build, index) => ({
          slot: index + 1,
          nature: build.nature,
          abilityId: build.ability.id,
          pokemonId: build.pokemon.id,
          evHp: build.evs.hp,
          evAtk: build.evs.attack,
          evDef: build.evs.defense,
          evSpAtk: build.evs.specialAttack,
          evSpDef: build.evs.specialDefense,
          evSpeed: build.evs.speed,
          moves: {
            create: build.moves.map((move, moveIndex) => ({
              slot: moveIndex + 1,
              gameMoveId: move.id,
            })),
          },
        })),
      },
    },
  })

  return { success: true, teamId: savedTeam.id }
}

export async function fetchTeams() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const userTeams = await prisma.team.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      members: {
        select: {
          ability: {
            select: {id: true, name: true}
          },
          pokemon: {
            select: {id: true, name: true, pokeapiId: true}
          },
          moves: {
            select: {id: true, slot: true, gameMove: {
              select: {move: {
                select: {id: true, name: true, type: true, category: true, power: true, accuracy: true}
              }}
            }}
          }
        }
      }
    }
  })

  if (!userTeams) throw new Error("Could not fetch user's teams!");
  
  // Fetch sprites for all Pokemon in parallel
  const teamsWithSprites: Team[] = await Promise.all(
    userTeams.map(async (team) => ({
      ...team,
      members: await Promise.all(
        team.members.map(async (member) => {
          const sprites = member.pokemon.pokeapiId
            ? await fetchSprites(member.pokemon.pokeapiId)
            : undefined

          return {
            ...member,
            pokemon: {
              ...member.pokemon,
              sprites: sprites ?? ({} as PokemonSprites),
            },
          }
        }),
      ),
    })),
  )

  return teamsWithSprites
}