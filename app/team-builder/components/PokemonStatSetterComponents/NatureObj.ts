// Nature effects: { increased: stat, decreased: stat }

export const natureEffects: Record<string, { increases: string; decreases: string }> = {
  // Neutral natures
  Hardy: { increases: 'none', decreases: 'none' },
  Docile: { increases: 'none', decreases: 'none' },
  Serious: { increases: 'none', decreases: 'none' },
  Bashful: { increases: 'none', decreases: 'none' },
  Quirky: { increases: 'none', decreases: 'none' },
  
  // +Attack
  Lonely: { increases: 'attack', decreases: 'defense' },
  Brave: { increases: 'attack', decreases: 'speed' },
  Adamant: { increases: 'attack', decreases: 'specialAttack' },
  Naughty: { increases: 'attack', decreases: 'specialDefense' },
  
  // +Defense
  Bold: { increases: 'defense', decreases: 'attack' },
  Relaxed: { increases: 'defense', decreases: 'speed' },
  Impish: { increases: 'defense', decreases: 'specialAttack' },
  Lax: { increases: 'defense', decreases: 'specialDefense' },
  
  // +Speed
  Timid: { increases: 'speed', decreases: 'attack' },
  Hasty: { increases: 'speed', decreases: 'defense' },
  Jolly: { increases: 'speed', decreases: 'specialAttack' },
  Naive: { increases: 'speed', decreases: 'specialDefense' },
  
  // +Sp.Attack
  Modest: { increases: 'specialAttack', decreases: 'attack' },
  Mild: { increases: 'specialAttack', decreases: 'defense' },
  Quiet: { increases: 'specialAttack', decreases: 'speed' },
  Rash: { increases: 'specialAttack', decreases: 'specialDefense' },
  
  // +Sp.Defense
  Calm: { increases: 'specialDefense', decreases: 'attack' },
  Gentle: { increases: 'specialDefense', decreases: 'defense' },
  Sassy: { increases: 'specialDefense', decreases: 'speed' },
  Careful: { increases: 'specialDefense', decreases: 'specialAttack' },
}