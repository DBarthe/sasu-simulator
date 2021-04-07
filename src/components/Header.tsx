import React from 'react';
import styles from '../styles/Header.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons'

interface HeaderProps {
  onClickScrollDown: () => any
}

export default function Header({ onClickScrollDown }: HeaderProps) {
  return (
    <div className={styles.header}>
      {/* SASU SIMULATOR 2021 */}
      <img src='/header4.png' alt='SASU SIMULATOR'></img>
      <svg width="0" height="0">
        <linearGradient id="arrow-gradient" spreadMethod="pad" x1="0%" y1="0%" x2="0%" y2="100%">

        <stop offset="0%" stopColor="rgb(240, 255, 0)" stopOpacity="1" />
        <stop offset="10%" stopColor="rgb(243, 225, 0)" stopOpacity="1" />
        <stop offset="25%" stopColor="rgb(245, 255, 149)" stopOpacity="1" />
        <stop offset="50%" stopColor="rgb(243, 225, 0)" stopOpacity="1" />
        <stop offset="100%" stopColor="rgb(170, 150, 0)" stopOpacity="1" />
{/*         
        <stop offset="0%" stopColor="rgb(170, 150, 0)" stopOpacity="1" />
        <stop offset="25%" stopColor="rgb(255, 255, 0)" stopOpacity="1" />
        <stop offset="50%" stopColor="rgb(189, 163, 0)" stopOpacity="1" />
        <stop offset="75%" stopColor="rgb(255, 255, 0)" stopOpacity="1" />
        <stop offset="100%" stopColor="rgb(170, 150, 0)" stopOpacity="1" /> */}

        </linearGradient>
      </svg>
      <FontAwesomeIcon className={styles.arrow} icon={faAngleDoubleDown} size="7x" onClick={onClickScrollDown} />
    </div>
  )
}