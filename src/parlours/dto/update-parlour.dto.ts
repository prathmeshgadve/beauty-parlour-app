export class UpdateParlourDto {
    name?: string;
    location?: {
        type: 'Point';
        coordinates: [number, number];
    };
    contact?: {
        phone: string;
        email: string;
    };
    services?: string[];
    packages?: string[];
    staff?: string[];
    menu?: string;
}