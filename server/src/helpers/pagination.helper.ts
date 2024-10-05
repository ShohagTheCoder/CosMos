import { Model } from 'mongoose';

interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: string; // Field to sort by
    sortOrder?: 'asc' | 'desc'; // Order of sorting
}

interface DateFilters {
    startDate?: Date;
    endDate?: Date;
}

interface PaginatedResult<T> {
    data: T[];
    limit: number;
    page: number;
    totalDocuments: number;
    totalPages: number;
}

export async function paginate<T>(
    model: Model<T>, // Mongoose Model
    query: any = {}, // Query object for filtering
    paginationOptions: PaginationOptions,
    dateFilters?: DateFilters,
    selectFields?: string, // Fields to select/exclude
): Promise<PaginatedResult<T>> {
    const {
        page,
        limit,
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = paginationOptions;
    const skip = (page - 1) * limit;

    // Apply date-based filters to the query if provided
    if (dateFilters) {
        const { startDate, endDate } = dateFilters;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = startDate;
            if (endDate) query.createdAt.$lte = endDate;
        }
    }

    // Fetch total count of documents matching the query
    const totalDocuments = await model.countDocuments(query);

    // Fetch paginated documents
    const data = await model
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 }) // Apply sorting
        .select(selectFields) // Select specified fields if provided
        .exec();

    // Calculate total pages
    const totalPages = Math.ceil(totalDocuments / limit);

    // Return the result as a structured object
    return {
        data,
        limit,
        page,
        totalDocuments,
        totalPages,
    };
}
