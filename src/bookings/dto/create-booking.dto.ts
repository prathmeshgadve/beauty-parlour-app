export class CreateBookingDto {
    customer: string;
    parlour: string;
    services: string[];
    package?: string;
    appointmentTime: Date;
}