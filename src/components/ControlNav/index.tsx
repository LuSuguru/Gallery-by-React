import { memo, MouseEventHandler } from 'react'
import classnames from 'clsx'

import { ImgData } from '@/types/data'

import style from './style.module.less'

interface ControlNavProps extends ImgData {
  onInverse: () => void
  onMoveCenter: () => void
}

export default memo<ControlNavProps>((props) => {
  const { isCenter, isInverse } = props

  const onClick: MouseEventHandler<any> = (e) => {
    e.stopPropagation()
    e.preventDefault()

    isCenter ? props.onInverse() : props.onMoveCenter()
  }

  const className = classnames(style.unit, {
    [style.isCenter]: isCenter,
    [style.isInverse]: isInverse
  })

  return (
    <span className={className} onClick={onClick} />
  )
})
