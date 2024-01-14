import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { IContentParser } from "../ports/IContentParser";

export class QuillContentParser implements IContentParser{
    parse(raw: string): string {
        const deltaConverter = new QuillDeltaToHtmlConverter(JSON.parse(raw).ops, {
            inlineStyles: true
        })
        return deltaConverter.convert()
    }
}