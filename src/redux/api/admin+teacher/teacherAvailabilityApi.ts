import { url } from "inspector";
import { baseApi } from "../baseApi";

export const teacherAvailabilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeacherAvailabilityById: builder.query({
      query: (teacher_id?: number) =>
        `/teacher-availability?teacher_id=${teacher_id}`,
      providesTags: (result, error, id) => [
        { type: "TeacherAvailability", id: id },
      ],
    }),
    getTeacherAvailabilityForEdit: builder.query({
      query: ({
        teacher_id,
        day_of_week,
      }: {
        teacher_id: number;
        day_of_week: number;
      }) =>
        `/teacher-availability?teacher_id=${teacher_id}&day_of_week=${day_of_week}`,
      providesTags: (result, error, { teacher_id, day_of_week }) => [
        { type: "TeacherAvailability", id: `${teacher_id}-${day_of_week}` },
      ],
    }),
    getClassTimeDuration: builder.query({
      query: () => "/class-time",
      providesTags: ["Settings", "TeacherAvailability"],
    }),
    addTeacherAvailability: builder.mutation({
      query: (data) => ({
        url: "/teacher-availability",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TeacherAvailability"],
    }),
    updateTeacherAvailability: builder.mutation({
      query: (data) => ({
        url: "/teacher-availability/update",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TeacherAvailability"],
    }),
    deleteSingleSlot: builder.mutation({
      query: (slotId) => ({
        url: `/teacher-availability/${slotId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { teacher_id, slotId }) => [
        { type: "TeacherAvailability", id: `${teacher_id}-${slotId}` },
      ],
    }),
  }),
});

export const {
  useGetTeacherAvailabilityByIdQuery,
  useGetTeacherAvailabilityForEditQuery,
  useGetClassTimeDurationQuery,
  useAddTeacherAvailabilityMutation,
  useUpdateTeacherAvailabilityMutation,
  useDeleteSingleSlotMutation
} = teacherAvailabilityApi;
