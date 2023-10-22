const isDefined = <T>(value: T | undefined | null): value is T => {
    return <T>value !== undefined && <T>value !== null;
}

export {isDefined}