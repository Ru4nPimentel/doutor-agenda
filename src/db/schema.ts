import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  uuid,
  text,
  time,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
});

export const clinicsTable = pgTable("clinics", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updateAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userToClinicsTable = pgTable("user_to_clinics", {
  userId: uuid("user_id")
    .notNull() //não pode ser nulo, pois é uma referência obrigatória
    .references(() => usersTable.id), //referencia o id da tabela users
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updateAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const doctorsTable = pgTable("doctors", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {
    onDelete: "cascade", //deleta os médicos se a clínica for deletada
  }),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url").notNull(),
  speciality: text("specialty").notNull(),
  // 1 - monday, 2 - tuesday, 3 - wednesday, 4 - thursday, 5 - friday, 6 - saturday, 0 - sunday
  availableFromWeekday: integer("available_from_weekday").notNull(),
  availableToWeekday: integer("available_to_weekday").notNull(),
  availableFromTime: time("available_from_weekday").notNull(),
  availableToTime: time("available_to_weekday").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updateAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const patientsSexEnum = pgEnum("patients_sex", ["male", "female"]);

export const patientsTable = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicsId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone").notNull(),
  sex: patientsSexEnum("sex").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updateAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const appointmentsTable = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  data: timestamp("date").notNull(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patientsTable.id),
  doctorId: uuid("doctor_id")
    .notNull()
    .references(() => doctorsTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updateAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  userToClinics: many(userToClinicsTable), //relaciona a tabela users com a tabela user_to_clinics
}));

export const clinicsTableRelation = relations(clinicsTable, ({ many }) => ({
  //relacionamento da tabela clinics
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  appointments: many(appointmentsTable),
  userToClinics: many(userToClinicsTable), //relaciona a tabela clinics com a tabela user_to_clinics
}));

export const userToClinicsTableRelations = relations(
  userToClinicsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [userToClinicsTable.userId], //relaciona o campo userId da tabela user_to_clinics com o campo id da tabela users
      references: [usersTable.id],
    }),
    clinic: one(clinicsTable, {
      fields: [userToClinicsTable.clinicId], //relaciona o campo clinicId da tabela user_to_clinics com o campo id da tabela clinics
      references: [clinicsTable.id],
    }),
  }),
);

export const doctorsTableRelations = relations(
  doctorsTable,
  ({ one, many }) => ({
    clinic: one(clinicsTable, {
      fields: [doctorsTable.clinicId], //relaciona o campo clinicId da tabela doctors com o campo id da tabela clinics
      references: [clinicsTable.id],
    }),
    appointments: many(appointmentsTable), //relaciona a tabela doctors com a tabela appointments
  }),
);

export const patientsTableRelations = relations(
  patientsTable,
  ({ one, many }) => ({
    clinic: one(clinicsTable, {
      fields: [patientsTable.clinicsId], //relaciona o campo clinicsId da tabela patients com o campo id da tabela clinics
      references: [clinicsTable.id],
    }),
    appointments: many(appointmentsTable), //relaciona a tabela patients com a tabela appointments
  }),
);

export const appointmentsTableRelations = relations(
  appointmentsTable,
  ({ one }) => ({
    clinic: one(clinicsTable, {
      fields: [appointmentsTable.clinicId],
      references: [clinicsTable.id],
    }),
    patient: one(patientsTable, {
      fields: [appointmentsTable.patientId],
      references: [patientsTable.id],
    }),
    doctor: one(doctorsTable, {
      fields: [appointmentsTable.doctorId],
      references: [doctorsTable.id],
    }),
  }),
);
