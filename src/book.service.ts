import { Injectable, OnModuleInit } from '@nestjs/common';
import { Book } from './Book';
import { readFile } from 'fs/promises';
import {BookDto} from "./Book.dto";
import {HttpService} from "@nestjs/axios";
import {map, Observable, tap} from "rxjs";
import {AxiosResponse} from "axios";
import {ApiBook} from "./ApiBook";
import {response} from "express";

@Injectable()
export class BookService implements OnModuleInit{
    private storedBooks: Book[] = [];

    constructor(private readonly HttpService: HttpService) {}

    async onModuleInit() : Promise<void>{
        //await this.loadBooksFromFile();
        //await this.loadBooksFromAPI();

        await Promise.all([this.loadBooksFromFile(), this.loadBooksFromAPI()]);
    }

    private async loadBooksFromFile(): Promise<void>{
        try{
           const data = await readFile('./src/dataset.json');
           this.storedBooks = JSON.parse(data.toString());
       }catch(error){
           console.log('Err: $(error)');
       }
    }

    private async loadBooksFromAPI() : Promise<void>{
        this.HttpService
            .get<ApiBook[]>('https://api.npoint.io/1c88134cf081609075b7')
            .pipe(
                map((response) => response.data),
                tap((apiBooks) => {
                    apiBooks.forEach((elem) => {
                        return this.storedBooks.push({
                            title: elem.title,
                            author: elem.authors,
                            date: elem.publication_date,
                        });
                    });
                }),
            ).subscribe();
    }

/*
    async onModuleInit() : Promise<void> {
        /**
         * Old
         */
        /*readFile('./src/dataset.json', 'utf-8', (err, data) => {
            if(err) throw err;
            //console.log(data);
            this.storedBooks = JSON.parse(data);
        });*/

        /*return readFile('./src/dataset.json')
            .then((data) => {
                this.storedBooks = JSON.parse(data.toString());
            })
            .catch((err) => {
                throw new err;
            })*/
        //return Promise.resolve();

        /*return readFile('./src/dataset.json')
            .then((data) => {
                this.storedBooks = JSON.parse(data.toString());
            })
            .catch((err) => {
                throw new err;
            })*/
        /**
         * Current
         */
        /*try{
            const data = await readFile('./src/dataset.json');
            this.storedBooks = JSON.parse(data.toString());
        }catch(error){
            console.log('Err: $(error)');
        }*/

        /*try{
            const data = this.HttpService.get<ApiBook[]>('https://api.npoint.io/40518b0773c787f94072.');
            data.pipe(
                map((elem)=> elem.data),
                tap((elem)=> elem.forEach(e => this.storedBooks.push(new BookDto(e))))
            ).subscribe();
            console.log(this.storedBooks);
        }catch (error){
            console.log('Err: $(error)');
        }*/
/*
        this.HttpService
            .get<ApiBook[]>('https://api.npoint.io/40518b0773c787f94072')
            .pipe(
                map((response) => response.data),
                tap((apiBooks) => {
                    apiBooks.forEach((elem) => {
                        return this.storedBooks.push({
                            title: elem.title,
                            author: elem.authors,
                            date: elem.publication_date,
                        });
                    });
                }),
            ).subscribe();
    }
    */

    addBook(book: Book): void {
        if (
            !this.storedBooks.some((storedBook) => book.title === storedBook.title)
        ) {
            this.storedBooks.push(book);
        }
    }

    getBook(title: string): Book {
        const book = this.storedBooks.find((book) => book.title === title);
        if (!book) {
            throw new Error(`No book with title ${title}`);
        }
        return book;
    }

    getBooksOf(author: string): Book[] {
        return this.storedBooks.filter((book) => book.author === author);
    }

    getAllBooks(): Book[] {
        return this.storedBooks.sort((book1, book2) =>
            book1.title.toLowerCase().localeCompare(book2.title.toLowerCase()),
        );
    }

    getTotalNumberOfBooks(): number {
        return this.storedBooks.length;
    }

    getBooksPublishedAfter(date: string | Date): Book[] {
        const dateAsDate = new Date(date);

        return this.storedBooks.filter(
            (book) => new Date(book.date).getTime() >= dateAsDate.getTime(),
        );
    }

    removeBook(title: string) {
        this.storedBooks = this.storedBooks.filter((book) => book.title !== title);
    }

    searchByAuthorAndTitle(term: string): Book[] {
        const escapedTerm = term.toLowerCase().trim();

        return this.storedBooks.filter((book) => {
            return (
                book.title.toLowerCase().includes(escapedTerm) ||
                book.author.toLowerCase().includes(escapedTerm)
            );
        });
    }

    /*init(){
        readFile('./dataset.json', 'UTF-8', (err, data) => {
            let datas = string;
            datas
        })
    }*/
}