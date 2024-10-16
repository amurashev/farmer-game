import { Point } from '../types/grid'

const doLogs = (...params: any) => false && console.warn(...params)

export type SegmentsData = {
  x: Record<string, number[][]>
  y: Record<string, number[][]>
  all: number[][][]
}

export const getAllSegments = (roads: number[][]) => {
  const obj: {
    x: Record<string, number[]>
    y: Record<string, number[]>
  } = {
    x: {},
    y: {},
  }
  roads.forEach((item) => {
    const [x, y] = item

    if (!obj.x[x]) obj.x[x.toString()] = []
    obj.x[x].push(y)

    if (!obj.y[y]) obj.y[y.toString()] = []
    obj.y[y].push(x)
  })

  Object.keys(obj.x).forEach((position) => {
    if (obj.x[position].length > 1) {
      obj.x[position] = [...obj.x[position]].sort((a, b) => a - b)
    }
  })
  Object.keys(obj.y).forEach((position) => {
    if (obj.y[position].length > 1) {
      obj.y[position] = [...obj.y[position]].sort((a, b) => a - b)
    }
  })

  const final: SegmentsData = {
    x: {},
    y: {},
    all: [],
  }

  const getRanges = (arr: number[]) => {
    const min = Math.min(...arr)
    const max = Math.max(...arr)

    const finalArr = []
    let p1 = min

    for (let i = min; i <= max; i += 1) {
      if (arr.includes(i) && !arr.includes(i - 1)) {
        p1 = i
      }

      if (arr.includes(i) && !arr.includes(i + 1) && p1 !== i) {
        finalArr.push([p1, i])
        p1 = i
      }
    }

    return finalArr
  }

  Object.keys(obj.x).forEach((position) => {
    const ranges = getRanges(obj.x[position])

    if (ranges.length) {
      final.x[position] = [...ranges]
    }

    ranges.forEach((range) => {
      final.all.push([
        [Number(position), range[0]],
        [Number(position), range[1]],
      ])
    })
  })

  Object.keys(obj.y).forEach((position) => {
    const ranges = getRanges(obj.y[position])

    if (ranges.length) {
      final.y[position] = [...ranges]
    }

    ranges.forEach((range) => {
      final.all.push([
        [range[0], Number(position)],
        [range[1], Number(position)],
      ])
    })
  })

  return final
}

const isPointOnSegment = (segment: number[][], point: Point) => {
  const [sP1, sP2] = segment
  const [sP1x, sP1y] = sP1
  const [sP2x, sP2y] = sP2
  const [px, py] = point

  const isOnSegmentByX =
    sP1x === sP2x && px === sP2x && py >= sP1y && py <= sP2y
  const isOnSegmentByY =
    sP1y === sP2y && py === sP2y && px >= sP1x && px <= sP2x
  return isOnSegmentByX || isOnSegmentByY
}

const getAreSegmentsEqual = (segment1: number[][], segment2: number[][]) => {
  return (
    segment1[0][0] === segment2[0][0] &&
    segment1[0][1] === segment2[0][1] &&
    segment1[1][0] === segment2[1][0] &&
    segment1[1][1] === segment2[1][1]
  )
}

const getIsXLineSegment = (segment: number[][]) => {
  const [sP1, sP2] = segment
  return sP1[1] === sP2[1]
}

export const convertPathToPointsArray = (path: number[][]) => {
  const directPointPath: Point[] = []

  path.forEach((item, index) => {
    const nextItem = path[index + 1]

    if (nextItem) {
      if (item[0] === nextItem[0]) {
        // Y movement

        if (item[1] < nextItem[1]) {
          for (let i = item[1]; i < nextItem[1]; i += 1) {
            directPointPath.push([item[0], i])
          }
        } else {
          for (let i = item[1]; i > nextItem[1]; i -= 1) {
            directPointPath.push([item[0], i])
          }
        }
      }
      if (item[1] === nextItem[1]) {
        // X movement

        if (item[0] < nextItem[0]) {
          for (let i = item[0]; i < nextItem[0]; i += 1) {
            directPointPath.push([i, item[1]])
          }
        } else {
          for (let i = item[0]; i > nextItem[0]; i -= 1) {
            directPointPath.push([i, item[1]])
          }
        }
      }
    } else {
      directPointPath.push(item as Point)
    }
  })

  return directPointPath
}

export const getPath = ({
  allSegments,
  p1,
  p2,
}: {
  allSegments: SegmentsData
  p1: Point
  p2: Point
}): Point[] => {
  const { all: segments } = allSegments

  doLogs('findPath', p1, p2, allSegments)

  const possibleSegments = segments.filter((segment) =>
    isPointOnSegment(segment, p1)
  )

  doLogs('possibleSegments', possibleSegments)

  /**
   * There is no road that link start point
   */
  if (!possibleSegments.length) {
    return []
  }

  type SegmentResult = {
    deep: number
    path: number[][]
    segments: number[][][]
  }
  const findPointOnSegment = (
    finalPoint: Point,
    segment: number[][],
    checkPoint: Point,
    path: number[][],
    passedSegments: number[][][],
    level: number
  ): SegmentResult[] => {
    doLogs('findPointOnSegment', segment.join(), checkPoint, path, level)
    if (isPointOnSegment(segment, finalPoint)) {
      return [
        {
          deep: [...path, finalPoint].length,
          path: [...path, finalPoint],
          segments: passedSegments,
        },
      ]
    }

    const passedSegmentsToString = passedSegments.map((item) => item.join(';'))

    doLogs(
      'findPointOnSegment',
      level,
      checkPoint,
      passedSegments,
      passedSegmentsToString
    )

    // to prevent infinity in case of some issues
    if (level > 9) {
      return []
    }

    const isXLineSegment = getIsXLineSegment(segment)

    const segmentStart = isXLineSegment ? segment[0][0] : segment[0][1]
    const segmentEnd = isXLineSegment ? segment[1][0] : segment[1][1]

    const possibleInnerSegments = []

    doLogs('isXLineSegment', isXLineSegment, segmentStart, segmentEnd)

    for (
      let segmentPoint = Math.min(segmentStart, segmentEnd);
      segmentPoint <= Math.max(segmentStart, segmentEnd);
      segmentPoint += 1
    ) {
      if (isXLineSegment && checkPoint[0] === segmentPoint)
        continue /* eslint-disable-line no-continue */
      if (!isXLineSegment && checkPoint[1] === segmentPoint)
        continue /* eslint-disable-line no-continue */

      let pointOnSegment: Point
      if (isXLineSegment) {
        pointOnSegment = [segmentPoint, checkPoint[1]]
      } else {
        pointOnSegment = [checkPoint[0], segmentPoint]
      }

      const childSegments = segments.filter((innerSegment) => {
        const innerSegmentToString = innerSegment.join(';')
        return (
          isPointOnSegment(innerSegment, pointOnSegment) &&
          !getAreSegmentsEqual(segment, innerSegment) &&
          !passedSegmentsToString.includes(innerSegmentToString)
        )
      })

      doLogs(
        'childSegments',
        segment.join(),
        segmentPoint,
        checkPoint,
        pointOnSegment.join(),
        childSegments
      )

      if (childSegments.length) {
        possibleInnerSegments.push({
          pointOnSegment,
          childSegments,
        })
      }
    }

    doLogs('possibleInnerSegments', segment.join(), possibleInnerSegments)

    return possibleInnerSegments.flatMap((item) =>
      item.childSegments.flatMap((child) =>
        findPointOnSegment(
          p2,
          child,
          item.pointOnSegment,
          [...path, item.pointOnSegment],
          [...passedSegments, child],
          level + 1
        )
      )
    )
  }

  const possiblePaths = possibleSegments.flatMap((segment) =>
    findPointOnSegment(p2, segment, p1, [p1], [segment], 0)
  )

  if (!possiblePaths.length) {
    return []
  }

  const possiblePathsWithPoints = possiblePaths.map((item) => ({
    ...item,
    points: convertPathToPointsArray(item.path),
  }))

  const possiblePathsWithPointsSorted = [...possiblePathsWithPoints].sort(
    (a, b) => {
      let aPoints = 0
      let bPoints = 0

      if (a.points.length < b.points.length) aPoints += 100
      if (a.points.length > b.points.length) bPoints += 100

      if (a.deep < b.deep) aPoints += 10
      if (a.deep > b.deep) bPoints += 10

      return bPoints - aPoints
    }
  )

  return possiblePathsWithPointsSorted[0].points
}
