/**
 * Theme decorator
 * @param wrappedComponent
 * @param themeFunction
 * @returns {function(): *}
 */
export default function theme(wrappedComponent, themeFunction) {
    const renderDecorator = (oldRender) => {
        return function () {
            return themeFunction(this, () => {
                return oldRender.apply(this, arguments)
            });
        }
    };
    wrappedComponent.prototype.render = renderDecorator(wrappedComponent.prototype.render);
}
