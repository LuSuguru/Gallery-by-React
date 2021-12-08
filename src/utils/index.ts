/**
 * 获取区间内的一个随机值
 */
export function getRangeRandom(low: number, high: number) {
  return Math.ceil(Math.random() * (high - low) + low)
}

/**
 *  获取0~30之间的一个任意正负值角度
 */
export function get30DegRandom() {
  return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30)
}
