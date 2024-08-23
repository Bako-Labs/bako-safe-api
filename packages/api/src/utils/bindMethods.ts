function bindMethods(instance: unknown) {
  const methodNames = Object.getOwnPropertyNames(
    Object.getPrototypeOf(instance),
  );

  methodNames
    .filter(
      (methodName) =>
        methodName !== 'constructor' &&
        typeof instance[methodName] === 'function',
    )
    .forEach((methodName) => {
      instance[methodName] = instance[methodName].bind(instance);
    });
}

export { bindMethods };
