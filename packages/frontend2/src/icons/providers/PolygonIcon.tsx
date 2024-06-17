import React, { type SVGAttributes } from 'react'
import { cn } from '~/utils/cn'

let i = 0

export function PolygonIcon(props: SVGAttributes<SVGElement>) {
  const current = i++
  const gradientId = `polygon-icon-gradient-${current}`

  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        aria-label="polygon logo"
        {...props}
        style={{ fill: `url(#${gradientId})` }}
        className={cn('dark:hidden', props.className)}
      >
        <g
          transform="matrix(1.5 0 0 1.5 -1.5e-5 -.00025497)"
          clipPath="url(#clip0_977_13790)"
        >
          <path d="m11.649 10.723 3.5696-2.0608c0.1888-0.10912 0.3062-0.31232 0.3062-0.53056v-4.1222c0-0.21792-0.1174-0.42144-0.3062-0.53056l-3.5696-2.0608c-0.1888-0.10912-0.4237-0.1088-0.6125 0l-3.5696 2.0608c-0.1888 0.10912-0.30624 0.31232-0.30624 0.53056v7.3661l-2.503 1.4448-2.503-1.4448v-2.8906l2.503-1.4448 1.6512 0.95296v-1.9389l-1.345-0.77632c-0.0928-0.05344-0.19872-0.0816-0.30624-0.0816s-0.21344 0.02816-0.30624 0.0816l-3.5699 2.0611c-0.1888 0.10912-0.30624 0.31232-0.30624 0.53056v4.1219c0 0.2179 0.11744 0.4214 0.30624 0.5306l3.5696 2.0611c0.1888 0.1088 0.42336 0.1088 0.61248 0l3.5696-2.0608c0.1888-0.1091 0.30624-0.3127 0.30624-0.5306v-7.3661l0.04512-0.02592 2.4579-1.4189 2.5031 1.4451v2.8902l-2.5031 1.4451-1.6486-0.95168v1.9389l1.3424 0.77538c0.1888 0.1088 0.4237 0.1088 0.6125 0z" />
        </g>
        <defs>
          <linearGradient
            id={gradientId}
            x1="1.7546"
            x2="14.689"
            y1="12.554"
            y2="3.1226"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A726C1" offset="0" />
            <stop stopColor="#803BDF" offset=".88" />
            <stop stopColor="#7B3FE4" offset="1" />
          </linearGradient>
          <clipPath id="clip0_977_13790">
            <rect width="16" height="16" fill="#fff" />
          </clipPath>
        </defs>
      </svg>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        aria-label="polygon logo"
        {...props}
        className={cn('hidden dark:inline dark:fill-current', props.className)}
      >
        <g
          transform="matrix(1.5 0 0 1.5 -1.5e-5 -.00025497)"
          clipPath="url(#clip0_977_13790)"
        >
          <path d="m11.649 10.723 3.5696-2.0608c0.1888-0.10912 0.3062-0.31232 0.3062-0.53056v-4.1222c0-0.21792-0.1174-0.42144-0.3062-0.53056l-3.5696-2.0608c-0.1888-0.10912-0.4237-0.1088-0.6125 0l-3.5696 2.0608c-0.1888 0.10912-0.30624 0.31232-0.30624 0.53056v7.3661l-2.503 1.4448-2.503-1.4448v-2.8906l2.503-1.4448 1.6512 0.95296v-1.9389l-1.345-0.77632c-0.0928-0.05344-0.19872-0.0816-0.30624-0.0816s-0.21344 0.02816-0.30624 0.0816l-3.5699 2.0611c-0.1888 0.10912-0.30624 0.31232-0.30624 0.53056v4.1219c0 0.2179 0.11744 0.4214 0.30624 0.5306l3.5696 2.0611c0.1888 0.1088 0.42336 0.1088 0.61248 0l3.5696-2.0608c0.1888-0.1091 0.30624-0.3127 0.30624-0.5306v-7.3661l0.04512-0.02592 2.4579-1.4189 2.5031 1.4451v2.8902l-2.5031 1.4451-1.6486-0.95168v1.9389l1.3424 0.77538c0.1888 0.1088 0.4237 0.1088 0.6125 0z" />
        </g>
        <defs>
          <clipPath id="clip0_977_13790">
            <rect width="16" height="16" fill="#fff" />
          </clipPath>
        </defs>
      </svg>
    </>
  )
}
