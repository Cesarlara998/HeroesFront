interface thumbnail {
    extension: string
    path: string;
}

interface Character {
    descripcion: string,
    id: number,
    modified: Date,
    name: string,
    resourceUri: string;
    thumbnail: thumbnail
}
interface TeamsList {
    _id: string,
    name: string,
    description: string,
    characters: Character[],
}

interface HeroesList {
    page: number;
    data: Character[];
}

export type { TeamsList,Character,thumbnail,HeroesList }