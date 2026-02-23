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
      .input((val: unknown) => val as { id: number })
      .mutation(async ({ input }) => {
        const { approveSalesRepApplication, getSalesRepApplicationById } = await import('./db');
        const application = await getSalesRepApplicationById(input.id);
        await approveSalesRepApplication(input.id);
        
        // Send onboarding email
        if (application) {
          const { notifyOwner } = await import('./_core/notification');
          await notifyOwner({
            title: 'Sales Rep Onboarding - Welcome to ZAPPAY',
            content: `${application.fullName} has been approved as a ZAPPAY sales representative! Next steps: 1) Access your Sales Dashboard at /sales/dashboard 2) Review sales materials and pricing 3) Complete product training 4) Start reaching out to prospects! Contact: ${application.email}, Phone: ${application.phone}`
          });
        }
        
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
