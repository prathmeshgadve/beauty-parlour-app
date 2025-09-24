import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class GlobalValidationPipe implements PipeTransform{

  constructor(private schema:any){}
  transform(value: any, metadata: ArgumentMetadata) {
      try {
        if(metadata.type === 'query'){
            const {error} = this.schema.query.validate(value)
        }
      } catch (error) {
        
      }
  }  
}