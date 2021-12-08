import { forwardRef, CSSProperties, MouseEventHandler } from 'react'
import classnames from 'clsx'

import { ImgData } from '@/types/data'

import style from './style.module.less'

interface ImgFigureProps extends ImgData {
  onInverse: () => void
  onMoveCenter: () => void
}

export default forwardRef<HTMLDivElement, ImgFigureProps>((props, ref) => {
  const { title, desc, fileName, top, left, rotate, isCenter, isInverse } = props

  const onClick: MouseEventHandler<any> = (e) => {
    e.stopPropagation()
    e.preventDefault()

    isCenter ? props.onInverse() : props.onMoveCenter()
  }

  const styleObj: CSSProperties = { top, left }

  if (isCenter) {
    styleObj.zIndex = 11
  }

  if (rotate) {
    ['MozTransform', 'msTransform', 'WebkitTransform', 'transform'].forEach((value) => {
      styleObj[value] = `rotate(${rotate}deg)`
    })
  }

  return (
    <figure
      ref={ref}
      onClick={onClick}
      style={styleObj}
      className={classnames(style.figure, { [style.isInverse]: isInverse })}>
      <img src={require(`../../images/${fileName}`).default} alt={title} />
      <figcaption>
        <h2 className={style.title}>{title}</h2>
        <div className={style.back} onClick={onClick}>
          <p> {desc} </p>
        </div>
      </figcaption>
    </figure>
  )
})
