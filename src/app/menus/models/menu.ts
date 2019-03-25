export interface Menu {
    text: string;
    redirect?: string;
    blocked: boolean;
    deleted: boolean;
    createdAt: Date;
}
export class Menu {
    constructor(menu) {
        return this.format(menu);
    }
    
    format(menu) {
        if (menu.blocked === null || menu.blocked === undefined) {
            menu.blocked = true;
        }
        if (menu.deleted === null || menu.deleted === undefined) {
            menu.deleted = true;
        }
        if (!menu.createdAt || menu.createdAt === null || menu.createdAt === undefined) {
            menu.createdAt = new Date();
        }
        return menu;
    }
}
