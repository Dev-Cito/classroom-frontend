import { ListView } from "@/components/refine-ui/views/list-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { CreateButton } from "@/components/refine-ui/buttons/create.tsx";
import { DataTable } from "@/components/refine-ui/data-table/data-table.tsx";
import { useTable } from "@refinedev/react-table";
import { useList } from "@refinedev/core";
import { Class, Subject, User } from "@/types";
import { Badge } from "@/components/ui/badge.tsx";
import { ColumnDef } from "@tanstack/react-table";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    active: "default",
    inactive: "secondary",
    archived: "destructive",
};

const ClassesList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [selectedTeacher, setSelectedTeacher] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");

    const { data: subjectsData } = useList<Subject>({
        resource: "subjects",
        pagination: { pageSize: 100, mode: "server" },
        sorters: [{ field: "name", order: "asc" }],
    });

    const { data: teachersData } = useList<User>({
        resource: "users",
        pagination: { pageSize: 100, mode: "server" },
        sorters: [{ field: "name", order: "asc" }],
    });

    const subjects = subjectsData?.data ?? [];
    const teachers = teachersData?.data ?? [];

    // ✅ Build permanent filters using field names your backend actually reads
    const permanentFilters = [
        ...(searchQuery
            ? [{ field: "search", operator: "eq" as const, value: searchQuery }]
            : []),
        ...(selectedSubject !== "all"
            ? [{ field: "subject", operator: "eq" as const, value: selectedSubject }]
            : []),
        ...(selectedTeacher !== "all"
            ? [{ field: "teacher", operator: "eq" as const, value: selectedTeacher }]
            : []),
        ...(selectedStatus !== "all"
            ? [{ field: "status", operator: "eq" as const, value: selectedStatus }]
            : []),
    ];

    const classesTable = useTable<Class>({
        columns: useMemo<ColumnDef<Class>[]>(() => [
            {
                id: "banner",
                accessorKey: "bannerUrl",
                size: 80,
                header: () => <p className="column-title ml-2">Banner</p>,
                cell: ({ getValue }) => {
                    const url = getValue<string>();
                    return url ? (
                        <img src={url} alt="Class banner" className="h-10 w-16 rounded object-cover" />
                    ) : (
                        <div className="h-10 w-16 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            No image
                        </div>
                    );
                },
            },
            {
                id: "name",
                accessorKey: "name",
                size: 200,
                header: () => <p className="column-title">Class Name</p>,
                cell: ({ getValue }) => (
                    <span className="text-foreground font-medium">{getValue<string>()}</span>
                ),
            },
            {
                id: "status",
                accessorKey: "status",
                size: 110,
                header: () => <p className="column-title">Status</p>,
                cell: ({ getValue }) => {
                    const status = getValue<string>();
                    return <Badge variant={STATUS_VARIANT[status] ?? "outline"}>{status}</Badge>;
                },
            },
            {
                id: "subject",
                accessorKey: "subject.name",
                size: 150,
                header: () => <p className="column-title">Subject</p>,
                cell: ({ getValue }) => (
                    <Badge variant="secondary">{getValue<string>() ?? "-"}</Badge>
                ),
            },
            {
                id: "teacher",
                accessorKey: "teacher.name",
                size: 150,
                header: () => <p className="column-title">Teacher</p>,
                cell: ({ getValue }) => (
                    <span className="text-foreground">{getValue<string>() ?? "-"}</span>
                ),
            },
            {
                id: "capacity",
                accessorKey: "capacity",
                size: 100,
                header: () => <p className="column-title">Capacity</p>,
                cell: ({ getValue }) => (
                    <span className="text-foreground">{getValue<number>()}</span>
                ),
            },
        ], []),
        refineCoreProps: {
            resource: "classes",
            pagination: { pageSize: 10, mode: "server" },
            filters: {
                permanent: permanentFilters,
            },
            sorters: {
                initial: [{ field: "id", order: "desc" }],
            },
        },
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Classes</h1>

            <div className="intro-row">
                <p>Quick access to essential metrics and management tools.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Search by name"
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by subject..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subjects</SelectItem>
                                {subjects.map((s) => (
                                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by teacher..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Teachers</SelectItem>
                                {teachers.map((t) => (
                                    <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>

                        <CreateButton />
                    </div>
                </div>
            </div>

            <DataTable table={classesTable} />
        </ListView>
    );
};

export default ClassesList;
