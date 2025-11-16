export type Booking = {
    id: number;
    title: string;
    state: string;
    location: string;
    date: string;
    time: string;
    price: number;
};

export type BookingItemProps = {
    title: string;
    state: string;
    location: string;
    date: string;
    time: string;
    price: number;
};