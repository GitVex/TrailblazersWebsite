import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
 
export default ((userOpts) => {
  const opts = { userOpts }
  function YourComponent(props: QuartzComponentProps) {
 
    return <p>My favourite number is 0</p>
  }
 
  return YourComponent
}) satisfies QuartzComponentConstructor