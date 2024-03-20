export interface ModalAddBasketProps {
    modalName?: string,
    title?: string,
    onClose: (value?: string | number) => any,
    data: any,
    max?: number,
    min?: number,
    name?: string
    t: (key: string, amount?: number) => string
}
