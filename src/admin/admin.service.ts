import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
    getAdminDashboardData() {
        // This is a placeholder. In a real application, you'd fetch actual data.
        return {
            totalUsers: 100,
            activeUsers: 75,
            revenue: 10000,
        };
    }
}