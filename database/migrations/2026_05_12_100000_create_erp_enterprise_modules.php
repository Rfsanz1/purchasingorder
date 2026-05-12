<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('erp_asset_categories')) {
            Schema::create('erp_asset_categories', function (Blueprint $table) {
                $table->id();
                $table->string('kode', 50)->unique();
                $table->string('nama');
                $table->text('deskripsi')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_vendors')) {
            Schema::create('erp_vendors', function (Blueprint $table) {
                $table->id();
                $table->string('vendor_name');
                $table->string('npwp', 30)->nullable();
                $table->text('address')->nullable();
                $table->string('contact_person', 100)->nullable();
                $table->string('email', 100)->nullable();
                $table->string('bank_account', 100)->nullable();
                $table->string('vendor_category', 100)->nullable();
                $table->unsignedTinyInteger('rating')->nullable();
                $table->enum('status', ['Aktif', 'Non-Aktif'])->default('Aktif');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_entities')) {
            Schema::create('erp_entities', function (Blueprint $table) {
                $table->id();
                $table->string('entity_name');
                $table->string('entity_code', 50)->unique();
                $table->string('tax_id', 50)->nullable();
                $table->string('currency', 10)->default('IDR');
                $table->text('address')->nullable();
                $table->foreignId('parent_company_id')->nullable()->constrained('erp_entities')->nullOnDelete();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_assets')) {
            Schema::create('erp_assets', function (Blueprint $table) {
                $table->id();
                $table->string('asset_code', 50)->unique();
                $table->string('asset_name');
                $table->string('serial_number', 100)->nullable();
                $table->foreignId('category_id')->nullable()->constrained('erp_asset_categories')->nullOnDelete();
                $table->string('brand', 100)->nullable();
                $table->date('purchase_date')->nullable();
                $table->decimal('purchase_value', 15, 2)->default(0);
                $table->decimal('current_value', 15, 2)->default(0);
                $table->enum('depreciation_method', ['straight-line', 'declining-balance', 'sum-of-years', 'none'])->default('straight-line');
                $table->unsignedSmallInteger('useful_life')->default(0);
                $table->string('location', 150)->nullable();
                $table->string('department', 100)->nullable();
                $table->string('pic', 100)->nullable();
                $table->enum('asset_status', ['Aktif', 'In Maintenance', 'Rusak', 'Disposal', 'Dijual'])->default('Aktif');
                $table->string('qr_code', 150)->nullable();
                $table->text('notes')->nullable();
                $table->string('attachment')->nullable();
                $table->foreignId('account_id')->nullable()->constrained('erp_chart_of_accounts')->nullOnDelete();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_asset_maintenances')) {
            Schema::create('erp_asset_maintenances', function (Blueprint $table) {
                $table->id();
                $table->string('maintenance_number', 50)->unique();
                $table->foreignId('asset_id')->constrained('erp_assets')->cascadeOnDelete();
                $table->string('maintenance_type', 100)->nullable();
                $table->date('schedule_date')->nullable();
                $table->foreignId('vendor_id')->nullable()->constrained('erp_vendors')->nullOnDelete();
                $table->decimal('cost', 15, 2)->default(0);
                $table->string('technician', 100)->nullable();
                $table->text('result')->nullable();
                $table->date('next_maintenance_date')->nullable();
                $table->enum('status', ['scheduled', 'in-progress', 'completed', 'cancelled'])->default('scheduled');
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_asset_transfers')) {
            Schema::create('erp_asset_transfers', function (Blueprint $table) {
                $table->id();
                $table->string('transfer_number', 50)->unique();
                $table->foreignId('asset_id')->constrained('erp_assets')->cascadeOnDelete();
                $table->string('from_location', 150)->nullable();
                $table->string('to_location', 150)->nullable();
                $table->string('from_department', 100)->nullable();
                $table->string('to_department', 100)->nullable();
                $table->date('transfer_date')->nullable();
                $table->string('approved_by', 100)->nullable();
                $table->enum('status', ['draft', 'requested', 'approved', 'completed', 'rejected'])->default('draft');
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_asset_disposals')) {
            Schema::create('erp_asset_disposals', function (Blueprint $table) {
                $table->id();
                $table->string('disposal_number', 50)->unique();
                $table->foreignId('asset_id')->constrained('erp_assets')->cascadeOnDelete();
                $table->date('disposal_date')->nullable();
                $table->text('reason')->nullable();
                $table->decimal('disposal_value', 15, 2)->default(0);
                $table->string('approved_by', 100)->nullable();
                $table->enum('status', ['draft', 'approved', 'disposed', 'cancelled'])->default('draft');
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_asset_audit_logs')) {
            Schema::create('erp_asset_audit_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('asset_id')->nullable()->constrained('erp_assets')->nullOnDelete();
                $table->string('action', 150);
                $table->string('performed_by', 100)->nullable();
                $table->timestamp('performed_at')->nullable();
                $table->text('details')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_projects')) {
            Schema::create('erp_projects', function (Blueprint $table) {
                $table->id();
                $table->string('project_code', 50)->unique();
                $table->string('project_name');
                $table->string('customer_name')->nullable();
                $table->string('customer_reference', 100)->nullable();
                $table->date('start_date')->nullable();
                $table->date('end_date')->nullable();
                $table->decimal('budget', 15, 2)->default(0);
                $table->string('pic', 100)->nullable();
                $table->enum('priority', ['Low', 'Medium', 'High', 'Critical'])->default('Medium');
                $table->enum('status', ['Draft', 'Active', 'On Hold', 'Completed', 'Cancelled'])->default('Draft');
                $table->unsignedTinyInteger('progress')->default(0);
                $table->text('notes')->nullable();
                $table->decimal('total_billed', 15, 2)->default(0);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_project_tasks')) {
            Schema::create('erp_project_tasks', function (Blueprint $table) {
                $table->id();
                $table->foreignId('project_id')->constrained('erp_projects')->cascadeOnDelete();
                $table->string('task_name');
                $table->string('assignee', 100)->nullable();
                $table->date('deadline')->nullable();
                $table->unsignedTinyInteger('progress')->default(0);
                $table->foreignId('dependency_id')->nullable()->constrained('erp_project_tasks')->nullOnDelete();
                $table->string('attachment')->nullable();
                $table->enum('status', ['Todo', 'In Progress', 'Review', 'Done', 'Blocked'])->default('Todo');
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_project_milestones')) {
            Schema::create('erp_project_milestones', function (Blueprint $table) {
                $table->id();
                $table->foreignId('project_id')->constrained('erp_projects')->cascadeOnDelete();
                $table->string('title');
                $table->date('due_date')->nullable();
                $table->date('completed_at')->nullable();
                $table->enum('status', ['pending', 'completed', 'delayed'])->default('pending');
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_project_timesheets')) {
            Schema::create('erp_project_timesheets', function (Blueprint $table) {
                $table->id();
                $table->foreignId('project_id')->constrained('erp_projects')->cascadeOnDelete();
                $table->foreignId('task_id')->nullable()->constrained('erp_project_tasks')->nullOnDelete();
                $table->string('employee_name', 100)->nullable();
                $table->date('date')->nullable();
                $table->decimal('hours', 5, 2)->default(0);
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_project_costs')) {
            Schema::create('erp_project_costs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('project_id')->constrained('erp_projects')->cascadeOnDelete();
                $table->string('description', 150);
                $table->string('cost_type', 100)->nullable();
                $table->decimal('amount', 15, 2)->default(0);
                $table->date('incurred_date')->nullable();
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_documents')) {
            Schema::create('erp_documents', function (Blueprint $table) {
                $table->id();
                $table->string('document_number', 50)->unique();
                $table->string('document_type', 100);
                $table->string('related_module', 100)->nullable();
                $table->string('upload_file')->nullable();
                $table->string('version', 20)->nullable();
                $table->enum('approval_status', ['Draft', 'Pending', 'Approved', 'Rejected'])->default('Draft');
                $table->date('expired_date')->nullable();
                $table->string('retention_period', 100)->nullable();
                $table->text('notes')->nullable();
                $table->string('created_by', 100)->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_document_templates')) {
            Schema::create('erp_document_templates', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('module', 100)->nullable();
                $table->text('description')->nullable();
                $table->text('content')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_quality_inspections')) {
            Schema::create('erp_quality_inspections', function (Blueprint $table) {
                $table->id();
                $table->string('inspection_number', 50)->unique();
                $table->string('product', 150)->nullable();
                $table->foreignId('supplier_id')->nullable()->constrained('erp_suppliers')->nullOnDelete();
                $table->string('batch_number', 100)->nullable();
                $table->string('inspection_result', 100)->nullable();
                $table->unsignedInteger('defect_qty')->default(0);
                $table->text('notes')->nullable();
                $table->string('inspector', 100)->nullable();
                $table->enum('status', ['Draft', 'Passed', 'Failed'])->default('Draft');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_quality_ncrs')) {
            Schema::create('erp_quality_ncrs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('inspection_id')->nullable()->constrained('erp_quality_inspections')->nullOnDelete();
                $table->string('ncr_number', 50)->unique();
                $table->text('problem_description')->nullable();
                $table->text('root_cause')->nullable();
                $table->text('corrective_action')->nullable();
                $table->text('preventive_action')->nullable();
                $table->enum('status', ['Open', 'In Progress', 'Closed'])->default('Open');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_supplier_quality')) {
            Schema::create('erp_supplier_quality', function (Blueprint $table) {
                $table->id();
                $table->foreignId('supplier_id')->constrained('erp_suppliers')->cascadeOnDelete();
                $table->unsignedTinyInteger('rating')->default(0);
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_mrp_plans')) {
            Schema::create('erp_mrp_plans', function (Blueprint $table) {
                $table->id();
                $table->string('product', 150);
                $table->string('product_code', 100)->nullable();
                $table->decimal('forecast_demand', 15, 2)->default(0);
                $table->decimal('current_stock', 15, 2)->default(0);
                $table->decimal('safety_stock', 15, 2)->default(0);
                $table->unsignedSmallInteger('lead_time')->default(0);
                $table->decimal('suggested_purchase_qty', 15, 2)->default(0);
                $table->foreignId('warehouse_id')->nullable()->constrained('erp_warehouses')->nullOnDelete();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_vendor_scorecards')) {
            Schema::create('erp_vendor_scorecards', function (Blueprint $table) {
                $table->id();
                $table->foreignId('vendor_id')->constrained('erp_vendors')->cascadeOnDelete();
                $table->unsignedTinyInteger('score')->default(0);
                $table->text('feedback')->nullable();
                $table->date('evaluated_at')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_custom_reports')) {
            Schema::create('erp_custom_reports', function (Blueprint $table) {
                $table->id();
                $table->string('report_name');
                $table->string('module_source', 100)->nullable();
                $table->json('filters')->nullable();
                $table->string('grouping', 100)->nullable();
                $table->string('visualization_type', 50)->nullable();
                $table->string('schedule_report', 100)->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_delivery_trackings')) {
            Schema::create('erp_delivery_trackings', function (Blueprint $table) {
                $table->id();
                $table->string('delivery_number', 50)->unique();
                $table->string('driver', 100)->nullable();
                $table->string('vehicle', 100)->nullable();
                $table->string('gps_location', 100)->nullable();
                $table->enum('delivery_status', ['Pending', 'On Route', 'Delivered', 'Failed', 'Returned'])->default('Pending');
                $table->string('proof_of_delivery')->nullable();
                $table->string('order_reference', 100)->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_audit_trails')) {
            Schema::create('erp_audit_trails', function (Blueprint $table) {
                $table->id();
                $table->string('module', 100)->nullable();
                $table->string('action', 100);
                $table->string('reference', 100)->nullable();
                $table->string('performed_by', 100)->nullable();
                $table->text('details')->nullable();
                $table->string('ip_address', 50)->nullable();
                $table->timestamp('performed_at')->useCurrent();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_role_matrix')) {
            Schema::create('erp_role_matrix', function (Blueprint $table) {
                $table->id();
                $table->string('role_name', 100);
                $table->json('allowed_module')->nullable();
                $table->json('allowed_action')->nullable();
                $table->json('approval_access')->nullable();
                $table->json('branch_access')->nullable();
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_mfa_settings')) {
            Schema::create('erp_mfa_settings', function (Blueprint $table) {
                $table->id();
                $table->string('username', 100)->nullable();
                $table->boolean('enabled')->default(false);
                $table->string('method', 50)->default('sms');
                $table->string('phone', 30)->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_session_logs')) {
            Schema::create('erp_session_logs', function (Blueprint $table) {
                $table->id();
                $table->string('username', 100)->nullable();
                $table->string('session_token', 150)->nullable();
                $table->string('ip_address', 50)->nullable();
                $table->string('device', 100)->nullable();
                $table->text('user_agent')->nullable();
                $table->timestamp('started_at')->nullable();
                $table->timestamp('ended_at')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('erp_session_logs');
        Schema::dropIfExists('erp_mfa_settings');
        Schema::dropIfExists('erp_role_matrix');
        Schema::dropIfExists('erp_audit_trails');
        Schema::dropIfExists('erp_delivery_trackings');
        Schema::dropIfExists('erp_custom_reports');
        Schema::dropIfExists('erp_vendor_scorecards');
        Schema::dropIfExists('erp_mrp_plans');
        Schema::dropIfExists('erp_supplier_quality');
        Schema::dropIfExists('erp_quality_ncrs');
        Schema::dropIfExists('erp_quality_inspections');
        Schema::dropIfExists('erp_document_templates');
        Schema::dropIfExists('erp_documents');
        Schema::dropIfExists('erp_project_costs');
        Schema::dropIfExists('erp_project_timesheets');
        Schema::dropIfExists('erp_project_milestones');
        Schema::dropIfExists('erp_project_tasks');
        Schema::dropIfExists('erp_projects');
        Schema::dropIfExists('erp_asset_audit_logs');
        Schema::dropIfExists('erp_asset_disposals');
        Schema::dropIfExists('erp_asset_transfers');
        Schema::dropIfExists('erp_asset_maintenances');
        Schema::dropIfExists('erp_assets');
        Schema::dropIfExists('erp_entities');
        Schema::dropIfExists('erp_vendors');
        Schema::dropIfExists('erp_asset_categories');
    }
};
