export interface Section {
    id: string;
    title: any; // JSONB
    description: any; // JSONB
    url: string;
    status: 'Active' | 'Inactive';
    created_at?: string;
    updated_at?: string;
}

// Since we are using Supabase, we can use TypeScript interfaces to represent models
// Alternatively, if using Sequelize with Supabase (Postgres), we'd define Sequelize models.
// The user provided a Sequelize example, but also mentioned "using Supabase for the db now".
// For now, I'll provide an interface that matches the user's Sequelize example.
