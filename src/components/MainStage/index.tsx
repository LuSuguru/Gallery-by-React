import { FC, useEffect, useRef, useState } from 'react'

import { getRangeRandom, get30DegRandom } from '@/utils'

import imageDatas from '@/data/data.json'
import { ImgData } from '@/types/data'

import ImgFigure from '../ImgFigure'
import ControlNav from '../ControlNav'
import style from './style.module.less'

const MainStage: FC = () => {
  const stageRef = useRef<HTMLDivElement>()
  const imageRef = useRef<HTMLDivElement>()

  const constantRef = useRef({ // 存储取值范围
    centerPos: { // 中间值的取值范围
      left: 0,
      top: 0
    },

    hPosRange: { // 水平方向的取值范围
      leftsecX: [0, 0],
      rightsecX: [0, 0],
      y: [0, 0]
    },

    vPosRange: { // 竖直方向的取值范围
      x: [0, 0],
      topY: [0, 0]
    }
  })

  const [imgData, setImgData] = useState(imageDatas.map((item) => ({
    ...item,
    left: 0,
    top: 0,
    rotate: 0,
    isInverse: false,
    isCenter: false
  } as ImgData)))

  useEffect(() => {
    const stageW = stageRef.current.scrollWidth
    const stageH = stageRef.current.scrollHeight

    const halfStageW = Math.ceil(stageW / 2)
    const halfStageH = Math.ceil(stageH / 2)

    const imgFigureW = imageRef.current.scrollWidth
    const imgFigureH = imageRef.current.scrollHeight

    const halfImgW = Math.ceil(imgFigureW / 2)
    const halfImgH = Math.ceil(imgFigureH / 2)

    constantRef.current.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 左边区域水平位置的范围
    constantRef.current.hPosRange.leftsecX[0] = -halfImgW
    constantRef.current.hPosRange.leftsecX[1] = halfStageW - halfImgW * 3

    // 右边区域水平位置的范围
    constantRef.current.hPosRange.rightsecX[0] = halfStageW + halfImgW
    constantRef.current.hPosRange.rightsecX[1] = stageW - halfImgW

    // 左右区域竖直位置的范围
    constantRef.current.hPosRange.y[0] = -halfImgH
    constantRef.current.hPosRange.y[1] = stageH - halfImgH

    // 中间上区域水平位置的范围
    constantRef.current.vPosRange.x[0] = halfStageW - imgFigureW
    constantRef.current.vPosRange.x[1] = halfStageW

    // 中间上区域竖直位置的范围
    constantRef.current.vPosRange.topY[0] = -halfImgH
    constantRef.current.vPosRange.topY[1] = halfStageH - halfImgH * 3

    rearrange(0)
  }, [])

  /**
 * 重新布局所有图片
 * @param centerIndex 指定居中排布哪个图片
 */
  const rearrange = (centerIndex: number) => {
    const { centerPos, hPosRange, vPosRange } = constantRef.current
    const { leftsecX: hPosRangeLeftSecX, rightsecX: hPosRangeRightSecX, y: hPosRangeY } = hPosRange
    const { topY: vPosRangeTopY, x: vPosRangeX } = vPosRange

    // 中间位置图片
    const imgCenterArr = imgData.splice(centerIndex, 1)
    // 居中centerIndex的图片，居中的centerIndex的图片不需要旋转
    imgCenterArr[0] = {
      ...imgCenterArr[0],
      ...centerPos,
      rotate: 0,
      isCenter: true
    }

    // 取出要布局上侧的图片的状态信息
    const topImgNum = Math.floor(Math.random() * 2) // 取一个或者不取
    const topImgSpliceIndex = Math.ceil(Math.random() * (imgData.length - topImgNum)) // 取出的元素在数组的位置
    const imgTopArr = imgData.splice(topImgSpliceIndex, topImgNum)

    // 布局位于上侧的图片
    imgTopArr.forEach(item => {
      item.top = getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
      item.left = getRangeRandom(vPosRangeX[0], vPosRangeX[1])
      item.rotate = get30DegRandom()
      item.isCenter = false
    })

    // 布局位于两侧的图片
    for (let i = 0, j = imgData.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null

      hPosRangeLORX = (i < k ? hPosRangeLeftSecX : hPosRangeRightSecX) // 前半部分布局左边，右半部分布局右边

      imgData[i] = {
        ...imgData[i],
        top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
        left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1]),
        rotate: get30DegRandom(),
        isCenter: false
      }
    }

    // 将取出的数组合并
    if (imgTopArr[0]) {
      imgData.splice(topImgSpliceIndex, 0, imgTopArr[0])
    }

    imgData.splice(centerIndex, 0, imgCenterArr[0])

    setImgData([...imgData])
  }

  /**
   * 利用rearrange函数，居中对应index的图片
   * @param index 需要被居中的图片对应的图片数组的index值
   */
  const onMoveCenter = (index: number) => () => {
    rearrange(index)
  }

  /**
 * 翻转图片
 * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
 */
  const onInverse = (index: number) => () => {
    setImgData(imgData.map((item, i) => {
      if (i === index) {
        item.isInverse = !item.isInverse
      }
      return item
    }))
  }

  const ImgFigures = []
  const ControlNavs = []

  imgData.forEach((value, index) => {
    ImgFigures.push(
      <ImgFigure
        ref={imageRef}
        key={index}
        onInverse={onInverse(index)}
        onMoveCenter={onMoveCenter(index)}
        {...value} />
    )

    ControlNavs.push(
      <ControlNav
        key={index}
        onInverse={onInverse(index)}
        onMoveCenter={onMoveCenter(index)}
        {...value} />
    )
  })

  return (
    <section className={style.stage} ref={stageRef}>
      <section className={style.sec}>
        {ImgFigures}
      </section>

      <nav className={style.nav}>
        {ControlNavs}
      </nav>
    </section>
  )
}

export default MainStage
