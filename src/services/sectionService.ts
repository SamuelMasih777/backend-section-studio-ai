import supabase from './common/supabase';
import { Section } from '../models/Section';
import CustomError from '../models/CustomError';
import constants from '../models/constants';

class SectionService {
    async getAllSections() {
        const { data, error } = await supabase
            .from('sections')
            .select('*')
            .eq('is_deleted', false);

        if (error) {
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }

        return data;
    }

    async getSectionById(id: string) {
        const { data, error } = await supabase
            .from('sections')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw new CustomError(error.message, constants.httpStatus.notFound);
        }

        return data;
    }

    async createSection(sectionData: Partial<Section>) {
        const { data, error } = await supabase
            .from('sections')
            .insert([sectionData])
            .select();

        if (error) {
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }

        return data[0];
    }

    async updateSection(id: string, sectionData: Partial<Section>) {
        const { data, error } = await supabase
            .from('sections')
            .update(sectionData)
            .eq('id', id)
            .select();

        if (error) {
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }

        return data[0];
    }

    async deleteSection(id: string) {
        const { error } = await supabase
            .from('sections')
            .update({ is_deleted: true })
            .eq('id', id);

        if (error) {
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }

        return { message: "Section deleted successfully" };
    }
}

export default new SectionService();
