import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const salesRouter = router({
  register: publicProcedure
    .input(z.object({
      fullName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(1),
      location: z.string().min(1),
      experience: z.string().min(1),
      linkedinUrl: z.string().optional(),
      resume: z.string().optional(),
      whyJoin: z.string().min(10)
    }))
    .mutation(async ({ input }) => {
      const { createSalesRepApplication } = await import('./db');
      
      const application = await createSalesRepApplication({
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        location: input.location,
        experience: input.experience,
        linkedinUrl: input.linkedinUrl || null,
        resume: input.resume || null,
        whyJoin: input.whyJoin,
        status: 'pending_approval'
      });

      // Send notification to admin
      const { notifyOwner } = await import('./_core/notification');
      await notifyOwner({
        title: 'New Sales Rep Application',
        content: `${input.fullName} has applied to become a ZAPPAY sales representative. Experience: ${input.experience}. Review at /admin/applications`
      });
      
      return { success: true, applicationId: application.id };
    }),

  getAllApplications: publicProcedure
    .query(async () => {
      const { getAllSalesRepApplications } = await import('./db');
      return await getAllSalesRepApplications();
    }),

  approveApplication: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { approveSalesRepApplication } = await import('./db');
      await approveSalesRepApplication(input.id);
      return { success: true };
    }),

  rejectApplication: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { rejectSalesRepApplication } = await import('./db');
      await rejectSalesRepApplication(input.id);
      return { success: true };
    }),
});
