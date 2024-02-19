export interface IMedia {
    url: string;
    thumbnailUrl: string;
    name: string;
    description: string;
    caption: string;
    alternateName: string;
    type: 'image' | 'video';
}