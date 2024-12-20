import { QuartzComponent, QuartzComponentProps, QuartzComponentConstructor } from "../types";
import ContentFactory from "./Content";


const ProtectedContent: QuartzComponent = (componentData: QuartzComponentProps) => {
    const Content = ContentFactory()

    const user = localStorage.getItem('username');
    const allowedUsers = componentData.fileData.frontmatter?.allowedUsers as string[] ?? []

    if (!user || !allowedUsers.includes(user)) {
        return (
            <div class="access-denied">
                <p>Oops, No peeking!</p>
            </div>
        );
    } else {
        return (<div>
            <Content {...componentData} />
        </div>
        )
    }

}

export default (() => ProtectedContent) satisfies QuartzComponentConstructor
