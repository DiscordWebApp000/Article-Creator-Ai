declare module 'react-markdown' {
  import { ReactNode } from 'react'

  interface ReactMarkdownProps {
    children: string
    remarkPlugins?: any[]
    components?: {
      [key: string]: (props: { children: ReactNode; inline?: boolean }) => JSX.Element
    }
  }

  export default function ReactMarkdown(props: ReactMarkdownProps): JSX.Element
} 