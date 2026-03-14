"use server"
import prisma from "@/lib/prisma"
import { PokemonBuild } from "@/types/team"
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

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
    include: {
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

  return userTeams
}