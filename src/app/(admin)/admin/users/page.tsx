import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { CreateUserDialog, UserActions } from "@/components/admin/UserDialogs";

import { requireSuperAdmin } from "@/lib/auth-helpers";
import { ROLES } from "@/lib/roles";

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  await requireSuperAdmin();

  const users = await prisma.user.findMany({
    where: {
      role: {
        in: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EDITOR, ROLES.SUPER_ADMIN]
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="tw-space-y-6">
      <div className="tw-flex tw-items-center tw-justify-between">
        <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Users</h1>
        <CreateUserDialog />
      </div>

      <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-overflow-hidden">
        <div className="tw-overflow-x-auto">
          <table className="tw-w-full tw-text-left tw-text-sm">
            <thead className="tw-bg-gray-50 tw-border-b">
              <tr>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Name</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Email</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Phone</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Role</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Joined</th>
                <th className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="tw-divide-y">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="tw-px-6 tw-py-8 tw-text-center tw-text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:tw-bg-gray-50 tw-transition-colors">
                    <td className="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900">
                      {user.name}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                      {user.email || '-'}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                      {user.phone}
                    </td>
                    <td className="tw-px-6 tw-py-4">
                      <span className={`tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium tw-capitalize ${user.role === 'admin'
                        ? 'tw-bg-purple-100 tw-text-purple-800'
                        : 'tw-bg-blue-100 tw-text-blue-800'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-text-gray-600">
                      <UserActions user={user} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
