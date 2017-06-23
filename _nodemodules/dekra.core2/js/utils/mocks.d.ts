export declare class AlertMock {
    create(): any;
    dismiss(): Promise<{}>;
}
export declare class ToastMock {
    create(): any;
}
export declare class ConfigMock {
    get(): any;
    getBoolean(): boolean;
    getNumber(): number;
    setTransition(): void;
}
export declare class FormMock {
    register(): any;
}
export declare class ModalMock {
    create(): void;
}
export declare class NavMock {
    pop(): any;
    push(): any;
    getActive(): any;
    setRoot(): any;
    popToRoot(): any;
    get(): void;
}
export declare class PlatformMock {
    ready(): Promise<{
        String;
    }>;
    registerBackButtonAction(): Function;
    hasFocus(): boolean;
    doc(): HTMLDocument;
    is(): boolean;
    getElementComputedStyle(): any;
    onResize(callback: any): any;
    registerListener(): Function;
    win(): Window;
    raf(): number;
    timeout(callback: any, timer: number): any;
    cancelTimeout(): void;
    getActiveElement(): any;
}
export declare class StorageMock {
    get(): Promise<{}>;
    set(key: string, value: string): Promise<{}>;
    remove(key: string): Promise<{}>;
    query(): Promise<{
        res: {
            rows: Array<{}>;
        };
    }>;
}
export declare class MenuMock {
    close(): any;
}
export declare class AppMock {
    getActiveNav(): NavMock;
}
