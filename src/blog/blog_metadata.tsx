import { BlogListItemProps } from '../components/blog/blog_list_item';
import Chip8 from '../components/blog/chip8/chip8';

export interface BlogMetaData extends BlogListItemProps {
    renderBlog(): JSX.Element;
}

export const MetaData: BlogMetaData[] = [
    {
        id: 0,
        title: "Creating a CHIP-8 emulator/interpreter",
        description: "My brief introduciton to writing emulators.",
        date: new Date('01 Jan 1970 00:00:00 GMT'),
        tags: ["emulation", "chip8"],
        renderBlog: () => { return <Chip8 /> }
    }
];
