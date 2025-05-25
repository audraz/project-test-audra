'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../components/header'
import Banner from '../components/banner'
import styles from './page.module.css'

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [sort, setSort] = useState('-published_at')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchIdeas()
  }, [page, size, sort])

  const fetchIdeas = async () => {
    try {
      const res = await axios.get('https://suitmedia-backend.suitdev.com/api/ideas', {
        params: {
          'page[number]': page,
          'page[size]': size,
          append: ['small_image', 'medium_image'],
          sort: sort,
        },
        headers: {
          Accept: 'application/json',
        },
      })

      setIdeas(res.data.data)
      setTotal(res.data.meta.total)
    } catch (err) {
      console.error('Error fetching ideas', err)
    }
  }

  const getFullImageUrl = (url: string | null | undefined) => {
    if (!url) return ''
    return url.startsWith('http') ? url : `https://suitmedia-backend.suitdev.com${url}`
  }

  const totalPages = Math.ceil(total / size)

  return (
    <>
      <Header />
      <Banner />

      <div className={styles.pageWrapper}>
        <div className={styles.topControl}>
          <span>
            Showing {(page - 1) * size + 1} - {Math.min(page * size, total)} of {total}
          </span>
          <div className={styles.dropdownWrapper}>
            <label>
              Show per page:
              <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
                {[10, 20, 50].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Sort by:
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="-published_at">Newest</option>
                <option value="published_at">Oldest</option>
              </select>
            </label>
          </div>
        </div>

        <div className={styles.cardGrid}>
          {ideas.map((idea) => (
            <div key={idea.id} className={styles.card}>
              <div className={styles.thumbnailWrapper}>
                {idea.small_image?.url ? (
                  <img
                    src={getFullImageUrl(idea.small_image.url)}
                    alt={idea.title}
                    className={styles.thumbnail}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.thumbnailPlaceholder}>No Image</div>
                )}
              </div>
              <div className={styles.cardContent}>
                <p className={styles.date}>
                  {new Date(idea.published_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <h3 className={styles.title}>{idea.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.pagination}>
          <button className={styles.pageBtn} onClick={() => setPage(1)} disabled={page === 1}>
            «
          </button>
          <button className={styles.pageBtn} onClick={() => setPage(page - 1)} disabled={page === 1}>
            ‹
          </button>

          {page > 3 && (
            <>
              <button className={styles.pageBtn} onClick={() => setPage(1)}>1</button>
              <span className={styles.ellipsis}>…</span>
            </>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - page) <= 1)
            .map((p) => (
              <button
                key={p}
                className={`${styles.pageBtn} ${page === p ? styles.activePage : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}

          {page < totalPages - 2 && (
            <>
              <span className={styles.ellipsis}>…</span>
              <button className={styles.pageBtn} onClick={() => setPage(totalPages)}>
                {totalPages}
              </button>
            </>
          )}

          <button
            className={styles.pageBtn}
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            ›
          </button>
          <button
            className={styles.pageBtn}
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            »
          </button>
        </div>
      </div>
    </>
  )
}