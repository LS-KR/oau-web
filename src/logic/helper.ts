import {getLang} from "@/logic/config";
import {Icon} from "@/logic/icon";
import {info} from "@/logic/utils";
import moment from 'moment'
import Swal from 'sweetalert2';

/**
 * https://github.com/moh3n9595/js-abbreviation-number
 *
 * @param num
 * @param digit
 */
export function abbreviateNumber(
    num: number,
    digit = 1,
): string {
    const symbols = ["", "k", "M", "G", "T", "P", "E"]
    const padding = true

    // handle negatives
    const sign = Math.sign(num) >= 0;
    num = Math.abs(num);

    // what tier? (determines SI symbol)
    const tier = (Math.log10(num) / 3) | 0;

    // if zero, we don't need a suffix
    if (tier == 0) return (!sign ? "-" : "") + num.toString();

    // get suffix and determine scale
    const suffix = symbols[tier];
    if (!suffix) throw new RangeError();

    const scale = Math.pow(10, tier * 3);

    // scale the number
    const scaled = num / scale;

    let rounded = scaled.toFixed(digit);
    if (!padding) {
        rounded = String(Number(rounded));
    }

    // format number and add suffix
    return (!sign ? "-" : "") + rounded + suffix;
}

/**
 * Get date in YYYY-MM-DD
 */
export function getTodayDate(): string {
    return moment().format('YYYY-MM-DD')
}

export function randint(min: number, max: number): number {
    return Math.floor(rand(min, max))
}

export function rand(min: number, max: number): number {
    return Math.random() * (max - min + 1) + min
}

interface RequestInitWithParams extends RequestInit {
    params?: { [index: string]: string }
}

/**
 * Modify a fetch url
 *
 * @param input Fetch url input
 * @param callback Callback for modification
 */
export function reconstructUrl(input: URL | RequestInfo, callback: (URL) => URL | void): RequestInfo | URL {
    let u = new URL((input instanceof Request) ? input.url : input);
    const result = callback(u)
    if (result) u = result
    if (input instanceof Request) return {url: u, ...input}
    return u
}

/**
 * Fetch with url parameters
 */
export function fetchWithParams(input: URL | RequestInfo, init?: RequestInitWithParams): Promise<Response> {
    return fetch(reconstructUrl(input, u => {
        u.search = new URLSearchParams(init?.params ?? {}).toString()
    }), init)
}

/**
 * Fetch with langauge
 */
export function fetchWithLang(input: RequestInfo, init?: RequestInitWithParams): Promise<Response> {
    const lang = getLang()
    if (lang == 'zh_hans') return fetchWithParams(input, init)

    return fetchWithParams(reconstructUrl(input, (u: URL) => {
        // Insert language into the file name of the request
        const p = u.pathname.split('/')
        const last = p.length - 1
        const lsp = p[last].split('.')
        if (lsp.length < 2) return u
        lsp.splice(1, 0, lang)
        p[last] = lsp.join('.')
        u.pathname = p.join('/')

        info(`Detected language: ${lang}. Changing request to ${u.pathname}`)
    }), init)
}

/**
 * Fetch but handles errors better
 */
export async function fetchText(url: string, init?: RequestInitWithParams): Promise<string> {
    const response = await fetchWithParams(url, init)
    const text = await response.text()
    if (!response.ok) throw new Error(text)
    return text
}

export function getResponseSync(url: string): string {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    return xhr.responseText;
}

export function handleIconFromString(html: string): string {
    if (!html.includes('[!')) return html;
    return html.replace(/\[!(\w+)\](?::\s*(.*))?/g, (match, icon) => (Icon[icon as string]));
}

export function delay(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export async function scheduledTask(milliseconds: number, task: () => any) {
    await delay(milliseconds)
    task()
}

export async function scheduledLoopTask(milliseconds: number, task: () => any) {
    await delay(milliseconds)
    task()
    scheduledLoopTask(milliseconds, task)
}

export function toast(title: string, text: string, img: string, background: string, width: number, height: number, color: string) {
    Swal.fire({
        toast: true,
        position: "top-end",
        title: title,
        text: text,
        iconHtml: `<img style="width: ${width}px;height: ${height}px;border: none" src="${img}"></img>`,
        iconColor: "#00000000",
        background: background,
        timer: 5000,
        showConfirmButton: false,
        showCancelButton: false,
        timerProgressBar: true,
        color: color
    })
}

export function trim(str: string, ch: string) {
    let start = 0
    let end = str.length

    while (start < end && str[start] === ch)
        ++start;

    while (end > start && str[end - 1] === ch)
        --end;

    return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

export function shuffle(array: Array<any>): any[] {
    let currentIndex = array.length
    const arr = array.slice()

    while (currentIndex > 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }

    return arr;
}

export function gaussian_shuffle(array: Array<any>): any[] {
    let currentIndex = array.length
    const arr = array.slice()

    while (currentIndex > 0) {
        const randomIndex = Math.floor(gaussian() * currentIndex);
        currentIndex--;

        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }

    return arr;
}

export function gaussian(): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return gaussian() // resample between 0 and 1
    return num
}

export function gaussian_bm(min, max, skew) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random()
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0)
        num = gaussian_bm(min, max, skew) // resample between 0 and 1 if out of range

    else {
        num = Math.pow(num, skew) // Skew
        num *= max - min // Stretch to fill range
        num += min // offset to min
    }
    return num
}

export function checkSubset(parentArray: any[], subsetArray: any[]): boolean {
    return subsetArray.every((e) => {
        return parentArray.includes(e)
    })
}

export function insert(parentArray: any[], obj: any, index: number) {
    return [...parentArray.slice(0, index), obj, ...parentArray.slice(index)]
}

export function isTd() {
    const now = new Date();
    if ((now.getMonth() == 2) && (now.getDate() == 31)) return true;
    if ((now.getMonth() == 10) && (now.getDate() == 20)) return true;
    return false;
}
