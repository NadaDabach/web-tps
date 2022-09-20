import { IsNotEmpty, IsString } from 'class-validator';
import {ApiBook} from "./ApiBook";

export class BookDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly author: string;

    @IsNotEmpty()
    @IsString()
    readonly date: string;

    constructor(book: ApiBook) {
        this.title = book.title;
        this.author = book.authors;
        this.date = book.publication_date;
    }
}