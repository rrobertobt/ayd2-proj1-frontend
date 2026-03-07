export const rolesApi = {
  list: () => {
    return $api<Role[]>("/roles", {
      method: "GET",
    });
  }
}

export interface Role {
    id:   number;
    code: string;
    name: string;
}