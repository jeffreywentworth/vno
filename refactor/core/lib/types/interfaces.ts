export namespace Factory {
  export interface Options {
    entry: string;
    root: string;
    vue?: string;
    terminal?: boolean;
  }
  export interface AppStorage {
    [key: string]: App.Component;
  }
  export interface Storage {
    root: App.Component | unknown;
    app: AppStorage;
    vue: string;
    setRoot(component: App.Component): void;
    setVue(vue: string | undefined): void;
  }
  export interface Queue {
    components: App.Component[];
    length: number;
    enqueue(component: App.Component): void;
    dequeue(): App.Component | undefined;
    isEmpty(): boolean;
  }
  export interface DepsList {
    head: App.Component | null;
    tail: App.Component | null;
    add(component: App.Component): void;
    scrub(label: string): boolean;
  }
}

export namespace App {
  export interface Component {
    type: "composite" | "primitive";

    label: string;
    path: string;

    sourceRaw: string;
    split: string[];

    name: string | null;
    sibling: Component | null;

    template: string | null;
    script: string | null;
    middlecode: string | null;
    style: string | null;
    instance: string | null;

    isParsed: boolean;

    saveAsParent(): void;
    parseComponent(Storage: Factory.Storage, Queue: Factory.Queue): void;
    parseTemplate(ast: any): void;
    parseScript(
      analysis: any,
      storage: Factory.Storage,
      Queue: Factory.Queue,
    ): void;

    parseStyle(styles: any): void;
    componentStringify(): void;
    setComponentName(data: string[]): void;
    resolveScript(data: string[], tsCheck: boolean): void;
  }

  export interface composite extends Component {
    child: Factory.DepsList;
    attachChildren(
      children: string[],
      storage: Factory.Storage,
      Queue: Factory.Queue,
    ): void;
  }
}