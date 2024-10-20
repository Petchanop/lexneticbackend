import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    data: T;
}

@Injectable()
export class TaskResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    transformTask(data: any): Response<T> {
       return Array.isArray(data) ? data.map(item => {
            if ('user' in item) {
                delete item.user
                return item
            }})
        : 'user' in data ? delete data.user : data
    }

    transformTaskResponse(next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(map(data => {
            return this.transformTask(data)
        }));
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        console.log("task interceptor");
        return this.transformTaskResponse(next);
    }
}