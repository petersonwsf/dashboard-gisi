declare namespace JSX {
  interface IntrinsicElements {
    'ion-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      name?: string
      size?: string
      color?: string
      src?: string
      icon?: string
    }
  }
}