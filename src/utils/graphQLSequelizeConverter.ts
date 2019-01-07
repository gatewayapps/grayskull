import { Op } from 'sequelize'

export function convertFilterToSequelizeWhere(filter: any): any {
  if (!filter) {
    return {}
  }

  const finalWhere = Object.keys(filter).reduce((where, key) => {
    let val = filter[key]
    if (val === undefined) {
      return where
    }

    const { fieldName, operator } = parseKey(key)
    if (!operator) {
      return where
    }

    const finalOperator = operatorMap[operator]
    if (!finalOperator) {
      return where
    }

    if (['and', 'or'].includes(operator)) {
      where[finalOperator] = val.map((v) => convertFilterToSequelizeWhere(v))
    } else {
      switch (operator) {
        case 'contains':
        case 'notContains': {
          val = `%${val}%`
          break
        }
        case 'startsWith': {
          val = `${val}%`
          break
        }
        case 'endsWith': {
          val = `%${val}`
          break
        }
      }

      where[fieldName] = { [finalOperator]: val }
    }

    return where
  }, {})

  return finalWhere
}

const operatorMap = {
  and: Op.and,
  or: Op.or,
  lessThan: Op.lt,
  greaterThan: Op.gt,
  equals: Op.eq,
  notEquals: Op.ne,
  contains: Op.like,
  notContains: Op.notLike,
  in: Op.in,
  startsWith: Op.like,
  endsWith: Op.like
}

function parseKey(key: string) {
  const parts = key.split('_')
  const operator = parts.pop()
  const fieldName = parts.join('_')
  return {
    fieldName,
    operator
  }
}
