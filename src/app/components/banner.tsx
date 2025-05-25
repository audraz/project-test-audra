'use client'

import styles from './banner.module.css'

export default function Banner() {
  return (
    <div className={styles.banner}>
      <div className={styles.overlay} />
      <div className={styles.bannerContent}>
        <h1>Ideas</h1>
        <p>Where all great things begin</p>
      </div>
    </div>
  )
}
