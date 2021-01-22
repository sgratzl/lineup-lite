import { asCategoricalColumn, asNumberColumn, asTextColumn, LineUpLiteColumn } from '@lineup-lite/hooks';
import { autoAssignColors } from '@lineup-lite/components';
import {
  interpolateBlues,
  interpolateGreens,
  interpolateReds,
  interpolatePurples,
  interpolateBuPu,
  interpolateOrRd,
  schemeSet1,
  schemeSet3,
} from 'd3-scale-chromatic';

export interface IPokemonRow {
  name: string;
  type1: string;
  type2: string;
  color: string;
  ability1: string;
  ability2: string;
  'ability hidden': string;
  generation: string;
  legendary: boolean;
  mega_evolution: boolean;
  weight: number;
  height: number;

  hp: number;
  atk: number;
  def: number;
  sp_atk: number;
  sp_def: number;
  spd: number;
  total: number;
}

function invertScale(s: (v: number) => string) {
  return (v: number) => s(1 - v);
}

const defaultColumn: Partial<LineUpLiteColumn<IPokemonRow>> = {
  minWidth: 30,
  width: 150,
  maxWidth: 400,
  // canHide: false,
};

// NUMBER
// ・Each Pokemon has a number of Pokedex. It's listed in this column.
// ・Some Pokemon has multiple appearances, status, evolution or generation. In these cases, listed same numbers.
// CODE
// ・Some Pokemon has multiple appearances, status, evolution or generation.
// ・If the Pokemon has multiple appearances, status or other, to distinguish between each Pokemon.
// SERIAL
// ・The number to distinguish between each Pokemon, appearance, status or other factor.
// ・The number is 'NUMBER' times 10 plus 'CODE'.
// NAME
// ・Name for each Pokemon.
// TYPE1
// ・Each Pokemon has a type. The type is listed in this column.
// TYPE2
// ・Some Pokemon has two types(dual type). If the Pokemon is dual type, the second type is listed in this column.
// COLOR
// ・Each Pokemmon has a color. It's listed in this column.
// ABILITY1
// ・Each Pokemon has a ability. The ability is listed in this column.
// ABILITY2
// ・Some Pokemon has alternative ability. If the Pokemon has alternative ability, it is listed in this column.
// HIDDEN ABILITY
// ・Some Pokemon has special ability. it is listed in this column.
// GENERATION
// ・The number of generation each Pokemon.
// ・Mega evolved Pokemon's generation number is equivalent to origin(before evolution) Pokemon.
// LEGENDARY
// ・The Pokemon that A group of incredibly rare and often has very powerful status, called legendary Pokemon.
// ・If the Pokemon is legendary Pokemon(Include mythical Pokemon), then filled 1, else filled 0.
// MEGA_EVOLUTION
// ・Some Pokemon can Mega Evolve.
// ・If the Pokemon is Mega Evolved Pokemon, then filled 1, else filled 0.
// HEIGHT
// ・Height for each Pokemon.
// WEIGHT
// ・Weight for each Pokemon.
// HP (Hit Point)
// ・One of Pokemon's base stats. It determines how much damage a Pokemon can receive before fainting.
// ATK (Physical Attack)
// ・One of Pokemon's base stats. It determines how much damage the Pokemon deals when using a Physical Move.
// DEF (Physical Defense)
// ・One of Pokemon's base stats. It determines how much damage the Pokemon receives when it's hit with a Physical Move.
// SP_ATK (Special Attack)
// ・One of Pokemon's base stats. It determines how much damage the Pokemon deals when using a Special Move.
// SP_DEF (Special Defense)
// ・One of Pokemon's base stats. It determines how much damage the Pokemon receives when it's hit with a Special Move.
// SPD (Speed)
// ・One of Pokemon's base stats. It determines the order of Pokemon that can act in battle.
// TOTAL
// ・Summed up each base stats.

// https://gist.github.com/simsketch/1a029a8d7fca1e4c142cbfd043a68f19

export default function create(darkTheme: boolean) {
  return import('./pokemon').then((parsed) => {
    const types = new Set<string>();
    const rows = parsed.default.map((row: any) => {
      row.id = row.serial.toString();
      row.generation = String(row.generation);
      row.legendary = row.legendary === 1;
      row.mega_evolution = row.mega_evolution === 1;
      types.add(row.type1);
      types.add(row.type2);
      return row as IPokemonRow;
    });
    const typeCat = Array.from(types).sort().filter(Boolean);
    const colors = autoAssignColors([schemeSet3, schemeSet1].flat());
    const columns: LineUpLiteColumn<IPokemonRow>[] = [
      asTextColumn({
        Header: 'Name',
        tooltip: 'Name for each Pokemon',
        accessor: 'name',
        minWidth: 100,
      }),
      asCategoricalColumn(
        {
          Header: 'Type1',
          tooltip: 'Each Pokemon has a type. The type is listed in this column',
          accessor: 'type1',
          minWidth: 100,
        },
        {
          categories: typeCat,
          color: colors,
        }
      ),
      asCategoricalColumn(
        {
          Header: 'Type2',
          tooltip:
            'Some Pokemon has two types(dual type). If the Pokemon is dual type, the second type is listed in this column',
          accessor: 'type2',
          minWidth: 100,
        },
        {
          categories: typeCat,
          color: colors,
        }
      ),
      asCategoricalColumn({
        Header: 'Generation',
        accessor: 'generation',
        minWidth: 80,
      }),
      asNumberColumn(
        {
          Header: 'Hit Point',
          tooltip: "One of Pokemon's base stats. It determines how much damage a Pokemon can receive before fainting",
          accessor: 'hp',
          minWidth: 50,
        },
        {
          min: 0,
          max: 200,
          color: darkTheme ? interpolateBlues : invertScale(interpolateBlues),
        }
      ),
      asNumberColumn(
        {
          Header: 'Physical Attack',
          tooltip:
            "One of Pokemon's base stats. It determines how much damage the Pokemon deals when using a Physical Move",
          accessor: 'atk',
          minWidth: 50,
        },
        {
          min: 0,
          max: 200,
          color: darkTheme ? interpolatePurples : invertScale(interpolatePurples),
        }
      ),
      asNumberColumn(
        {
          Header: 'Physical Defense',
          tooltip:
            "One of Pokemon's base stats. It determines how much damage the Pokemon deals when using a Physical Move",
          accessor: 'def',
          minWidth: 50,
        },
        {
          min: 0,
          max: 200,
          color: darkTheme ? interpolateReds : invertScale(interpolateReds),
        }
      ),
      asNumberColumn(
        {
          Header: 'Special Attack',
          tooltip:
            "One of Pokemon's base stats. It determines how much damage the Pokemon deals when using a Special Move",
          accessor: 'sp_atk',
          minWidth: 50,
        },
        {
          min: 0,
          max: 200,
          color: darkTheme ? interpolateBuPu : invertScale(interpolateBuPu),
        }
      ),
      asNumberColumn(
        {
          Header: 'Special Defense',
          tooltip:
            "One of Pokemon's base stats. It determines how much damage the Pokemon receives when it's hit with a Special Move",
          accessor: 'sp_def',
          minWidth: 50,
        },
        {
          min: 0,
          max: 200,
          color: darkTheme ? interpolateOrRd : invertScale(interpolateOrRd),
        }
      ),
      asNumberColumn(
        {
          Header: 'Speed',
          tooltip: "One of Pokemon's base stats. It determines the order of Pokemon that can act in battle",
          accessor: 'spd',
          minWidth: 50,
        },
        {
          min: 0,
          max: 200,
          color: darkTheme ? interpolateGreens : invertScale(interpolateGreens),
        }
      ),
    ];

    return {
      author: 'Takamasa Kato',
      description:
        'Pokemon Gen 8 updated 2020 generated dataset, based on Kaggle: https://www.kaggle.com/takamasakato/ pokemon-all-status-data',

      rows,
      defaultColumn,
      columns: columns,
    };
  });
}
