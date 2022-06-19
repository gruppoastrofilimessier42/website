export default function () {
  function rplToRoles(rpl: number, roles: Object[]): Object[] | null {
    return roles.filter((role: any) => rpl & role.pow2);
  }
  function rolesToRpl(roles: any[]): number {
    return roles?.reduce((acc: number, role: any) => acc + (role.pow2 as number), 0) ?? 0;
  }
  return {
    rplToRoles,
    rolesToRpl,
  };
}
