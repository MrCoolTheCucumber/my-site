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
        date: new Date('01 April 2021 00:46:00 GMT'),
        tags: ["emulation", "chip8"],
        renderBlog: () => { return <Chip8 /> }
    }
];
