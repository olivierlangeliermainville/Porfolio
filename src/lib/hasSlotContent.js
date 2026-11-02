import { Comment, Fragment, Text } from 'vue';

/** True when the vnodes of a slot render something (not only comments or blank text) */
export function hasSlotContent(vnodes) {
  if (!vnodes) return false;

  return vnodes.some((vnode) => {
    if (vnode.type === Comment) return false;
    if (vnode.type === Text) return vnode.children.trim() !== '';
    if (vnode.type === Fragment) return hasSlotContent(vnode.children);
    return true;
  });
}
