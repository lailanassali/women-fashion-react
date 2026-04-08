'use client'

import { AnchorHTMLAttributes, ReactNode } from 'react'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  newTab?: boolean
  children: ReactNode
}

export function Link({ children, href, newTab, ...other }: LinkProps): React.JSX.Element {
  return (
    <a href={href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noreferrer' : undefined} {...other}>
      {children}
    </a>
  )
}
