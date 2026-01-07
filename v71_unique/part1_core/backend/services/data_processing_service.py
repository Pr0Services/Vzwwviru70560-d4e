"""
CHE·NU™ V72 - Data Processing Service
ETL operations, data transformations, and validation pipelines.

This service provides:
- Data extraction from various sources
- Data transformation and normalization
- Data validation and quality checks
- Data loading and export
- Schema validation
- Data mapping and conversion

Principle: GOVERNANCE > EXECUTION
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Callable, Union, Type
from dataclasses import dataclass, field
from enum import Enum
from uuid import uuid4
import json
import hashlib
import re
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)


# =============================================================================
# ENUMS & CONSTANTS
# =============================================================================

class DataSourceType(str, Enum):
    """Types of data sources."""
    JSON = "json"
    CSV = "csv"
    XML = "xml"
    DATABASE = "database"
    API = "api"
    FILE = "file"
    STREAM = "stream"
    MEMORY = "memory"


class TransformationType(str, Enum):
    """Types of data transformations."""
    MAP = "map"
    FILTER = "filter"
    REDUCE = "reduce"
    AGGREGATE = "aggregate"
    NORMALIZE = "normalize"
    DENORMALIZE = "denormalize"
    FLATTEN = "flatten"
    NEST = "nest"
    MERGE = "merge"
    SPLIT = "split"
    SORT = "sort"
    DEDUPLICATE = "deduplicate"
    ENRICH = "enrich"
    MASK = "mask"
    ENCRYPT = "encrypt"
    DECRYPT = "decrypt"


class ValidationLevel(str, Enum):
    """Validation strictness levels."""
    STRICT = "strict"
    NORMAL = "normal"
    LENIENT = "lenient"


class ValidationStatus(str, Enum):
    """Validation result status."""
    VALID = "valid"
    INVALID = "invalid"
    WARNING = "warning"


class ProcessingStatus(str, Enum):
    """Data processing status."""
    PENDING = "pending"
    EXTRACTING = "extracting"
    TRANSFORMING = "transforming"
    VALIDATING = "validating"
    LOADING = "loading"
    COMPLETED = "completed"
    FAILED = "failed"


# =============================================================================
# DATA CLASSES
# =============================================================================

@dataclass
class ValidationError:
    """Single validation error."""
    field: str
    message: str
    value: Any
    rule: str
    severity: str = "error"


@dataclass
class ValidationResult:
    """Result of validation."""
    status: ValidationStatus
    errors: List[ValidationError] = field(default_factory=list)
    warnings: List[ValidationError] = field(default_factory=list)
    validated_at: datetime = field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = field(default_factory=dict)

    @property
    def is_valid(self) -> bool:
        return self.status == ValidationStatus.VALID

    @property
    def error_count(self) -> int:
        return len(self.errors)

    @property
    def warning_count(self) -> int:
        return len(self.warnings)


@dataclass
class TransformationStep:
    """Single transformation step."""
    step_id: str
    transformation_type: TransformationType
    config: Dict[str, Any] = field(default_factory=dict)
    input_data: Any = None
    output_data: Any = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error: Optional[str] = None

    @property
    def duration_ms(self) -> Optional[int]:
        if self.started_at and self.completed_at:
            return int((self.completed_at - self.started_at).total_seconds() * 1000)
        return None


@dataclass
class ProcessingJob:
    """Data processing job."""
    job_id: str
    source_type: DataSourceType
    status: ProcessingStatus
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    input_records: int = 0
    output_records: int = 0
    error_records: int = 0
    transformation_steps: List[TransformationStep] = field(default_factory=list)
    validation_result: Optional[ValidationResult] = None
    error: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    @property
    def duration_ms(self) -> Optional[int]:
        if self.started_at and self.completed_at:
            return int((self.completed_at - self.started_at).total_seconds() * 1000)
        return None


@dataclass
class SchemaField:
    """Schema field definition."""
    name: str
    field_type: str  # string, number, boolean, array, object, date, email, etc.
    required: bool = False
    nullable: bool = True
    min_length: Optional[int] = None
    max_length: Optional[int] = None
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    pattern: Optional[str] = None  # Regex pattern
    enum_values: Optional[List[Any]] = None
    default: Any = None
    description: Optional[str] = None


@dataclass
class DataSchema:
    """Data schema definition."""
    schema_id: str
    name: str
    version: str
    fields: List[SchemaField]
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    description: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


# =============================================================================
# VALIDATORS
# =============================================================================

class Validator(ABC):
    """Base validator class."""
    
    @abstractmethod
    def validate(self, value: Any, field: SchemaField) -> List[ValidationError]:
        """Validate a value against a field schema."""
        pass


class StringValidator(Validator):
    """String type validator."""
    
    def validate(self, value: Any, field: SchemaField) -> List[ValidationError]:
        errors = []
        
        if value is None:
            if field.required and not field.nullable:
                errors.append(ValidationError(
                    field=field.name,
                    message=f"Field '{field.name}' is required",
                    value=value,
                    rule="required",
                ))
            return errors
        
        if not isinstance(value, str):
            errors.append(ValidationError(
                field=field.name,
                message=f"Expected string, got {type(value).__name__}",
                value=value,
                rule="type",
            ))
            return errors
        
        # Length checks
        if field.min_length is not None and len(value) < field.min_length:
            errors.append(ValidationError(
                field=field.name,
                message=f"Minimum length is {field.min_length}",
                value=value,
                rule="min_length",
            ))
        
        if field.max_length is not None and len(value) > field.max_length:
            errors.append(ValidationError(
                field=field.name,
                message=f"Maximum length is {field.max_length}",
                value=value,
                rule="max_length",
            ))
        
        # Pattern check
        if field.pattern:
            if not re.match(field.pattern, value):
                errors.append(ValidationError(
                    field=field.name,
                    message=f"Value does not match pattern '{field.pattern}'",
                    value=value,
                    rule="pattern",
                ))
        
        # Enum check
        if field.enum_values and value not in field.enum_values:
            errors.append(ValidationError(
                field=field.name,
                message=f"Value must be one of: {field.enum_values}",
                value=value,
                rule="enum",
            ))
        
        return errors


class NumberValidator(Validator):
    """Number type validator."""
    
    def validate(self, value: Any, field: SchemaField) -> List[ValidationError]:
        errors = []
        
        if value is None:
            if field.required and not field.nullable:
                errors.append(ValidationError(
                    field=field.name,
                    message=f"Field '{field.name}' is required",
                    value=value,
                    rule="required",
                ))
            return errors
        
        if not isinstance(value, (int, float)):
            errors.append(ValidationError(
                field=field.name,
                message=f"Expected number, got {type(value).__name__}",
                value=value,
                rule="type",
            ))
            return errors
        
        # Range checks
        if field.min_value is not None and value < field.min_value:
            errors.append(ValidationError(
                field=field.name,
                message=f"Minimum value is {field.min_value}",
                value=value,
                rule="min_value",
            ))
        
        if field.max_value is not None and value > field.max_value:
            errors.append(ValidationError(
                field=field.name,
                message=f"Maximum value is {field.max_value}",
                value=value,
                rule="max_value",
            ))
        
        return errors


class BooleanValidator(Validator):
    """Boolean type validator."""
    
    def validate(self, value: Any, field: SchemaField) -> List[ValidationError]:
        errors = []
        
        if value is None:
            if field.required and not field.nullable:
                errors.append(ValidationError(
                    field=field.name,
                    message=f"Field '{field.name}' is required",
                    value=value,
                    rule="required",
                ))
            return errors
        
        if not isinstance(value, bool):
            errors.append(ValidationError(
                field=field.name,
                message=f"Expected boolean, got {type(value).__name__}",
                value=value,
                rule="type",
            ))
        
        return errors


class EmailValidator(Validator):
    """Email type validator."""
    
    EMAIL_PATTERN = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    def validate(self, value: Any, field: SchemaField) -> List[ValidationError]:
        errors = []
        
        if value is None:
            if field.required and not field.nullable:
                errors.append(ValidationError(
                    field=field.name,
                    message=f"Field '{field.name}' is required",
                    value=value,
                    rule="required",
                ))
            return errors
        
        if not isinstance(value, str):
            errors.append(ValidationError(
                field=field.name,
                message=f"Expected string, got {type(value).__name__}",
                value=value,
                rule="type",
            ))
            return errors
        
        if not re.match(self.EMAIL_PATTERN, value):
            errors.append(ValidationError(
                field=field.name,
                message="Invalid email format",
                value=value,
                rule="email",
            ))
        
        return errors


class DateValidator(Validator):
    """Date type validator."""
    
    def validate(self, value: Any, field: SchemaField) -> List[ValidationError]:
        errors = []
        
        if value is None:
            if field.required and not field.nullable:
                errors.append(ValidationError(
                    field=field.name,
                    message=f"Field '{field.name}' is required",
                    value=value,
                    rule="required",
                ))
            return errors
        
        if isinstance(value, datetime):
            return errors
        
        if isinstance(value, str):
            try:
                # Try ISO format
                datetime.fromisoformat(value.replace('Z', '+00:00'))
                return errors
            except ValueError:
                pass
        
        errors.append(ValidationError(
            field=field.name,
            message="Invalid date format",
            value=value,
            rule="date",
        ))
        
        return errors


class ArrayValidator(Validator):
    """Array type validator."""
    
    def validate(self, value: Any, field: SchemaField) -> List[ValidationError]:
        errors = []
        
        if value is None:
            if field.required and not field.nullable:
                errors.append(ValidationError(
                    field=field.name,
                    message=f"Field '{field.name}' is required",
                    value=value,
                    rule="required",
                ))
            return errors
        
        if not isinstance(value, list):
            errors.append(ValidationError(
                field=field.name,
                message=f"Expected array, got {type(value).__name__}",
                value=value,
                rule="type",
            ))
            return errors
        
        # Length checks
        if field.min_length is not None and len(value) < field.min_length:
            errors.append(ValidationError(
                field=field.name,
                message=f"Minimum items is {field.min_length}",
                value=value,
                rule="min_length",
            ))
        
        if field.max_length is not None and len(value) > field.max_length:
            errors.append(ValidationError(
                field=field.name,
                message=f"Maximum items is {field.max_length}",
                value=value,
                rule="max_length",
            ))
        
        return errors


# =============================================================================
# TRANSFORMERS
# =============================================================================

class DataTransformer:
    """Data transformation engine."""
    
    def __init__(self):
        self.transformers: Dict[TransformationType, Callable] = {
            TransformationType.MAP: self._transform_map,
            TransformationType.FILTER: self._transform_filter,
            TransformationType.NORMALIZE: self._transform_normalize,
            TransformationType.FLATTEN: self._transform_flatten,
            TransformationType.DEDUPLICATE: self._transform_deduplicate,
            TransformationType.SORT: self._transform_sort,
            TransformationType.MASK: self._transform_mask,
            TransformationType.MERGE: self._transform_merge,
            TransformationType.AGGREGATE: self._transform_aggregate,
        }
    
    async def transform(
        self,
        data: Any,
        transformation_type: TransformationType,
        config: Dict[str, Any],
    ) -> Any:
        """Apply transformation to data."""
        transformer = self.transformers.get(transformation_type)
        if not transformer:
            raise ValueError(f"Unknown transformation type: {transformation_type}")
        
        return await transformer(data, config)
    
    async def _transform_map(self, data: List[Dict], config: Dict) -> List[Dict]:
        """Map fields from source to target."""
        mapping = config.get("mapping", {})
        result = []
        
        for record in data:
            new_record = {}
            for target_field, source_field in mapping.items():
                if isinstance(source_field, str):
                    new_record[target_field] = record.get(source_field)
                elif isinstance(source_field, dict):
                    # Complex mapping with transformation
                    source = source_field.get("source")
                    transform = source_field.get("transform")
                    value = record.get(source)
                    
                    if transform == "upper" and isinstance(value, str):
                        value = value.upper()
                    elif transform == "lower" and isinstance(value, str):
                        value = value.lower()
                    elif transform == "trim" and isinstance(value, str):
                        value = value.strip()
                    
                    new_record[target_field] = value
            result.append(new_record)
        
        return result
    
    async def _transform_filter(self, data: List[Dict], config: Dict) -> List[Dict]:
        """Filter records based on conditions."""
        conditions = config.get("conditions", [])
        operator = config.get("operator", "and")  # and/or
        
        def match_condition(record: Dict, condition: Dict) -> bool:
            field = condition.get("field")
            op = condition.get("operator")
            value = condition.get("value")
            record_value = record.get(field)
            
            if op == "eq":
                return record_value == value
            elif op == "ne":
                return record_value != value
            elif op == "gt":
                return record_value > value
            elif op == "gte":
                return record_value >= value
            elif op == "lt":
                return record_value < value
            elif op == "lte":
                return record_value <= value
            elif op == "contains" and isinstance(record_value, str):
                return value in record_value
            elif op == "startswith" and isinstance(record_value, str):
                return record_value.startswith(value)
            elif op == "endswith" and isinstance(record_value, str):
                return record_value.endswith(value)
            elif op == "in":
                return record_value in value
            elif op == "notin":
                return record_value not in value
            elif op == "exists":
                return field in record
            
            return False
        
        result = []
        for record in data:
            matches = [match_condition(record, c) for c in conditions]
            if operator == "and" and all(matches):
                result.append(record)
            elif operator == "or" and any(matches):
                result.append(record)
        
        return result
    
    async def _transform_normalize(self, data: List[Dict], config: Dict) -> List[Dict]:
        """Normalize field values."""
        normalizations = config.get("normalizations", {})
        result = []
        
        for record in data:
            new_record = dict(record)
            for field, normalization in normalizations.items():
                if field in new_record:
                    value = new_record[field]
                    norm_type = normalization.get("type")
                    
                    if norm_type == "trim" and isinstance(value, str):
                        new_record[field] = value.strip()
                    elif norm_type == "lowercase" and isinstance(value, str):
                        new_record[field] = value.lower()
                    elif norm_type == "uppercase" and isinstance(value, str):
                        new_record[field] = value.upper()
                    elif norm_type == "phone":
                        # Normalize phone number
                        if isinstance(value, str):
                            new_record[field] = re.sub(r'[^\d+]', '', value)
                    elif norm_type == "date":
                        # Normalize date format
                        if isinstance(value, str):
                            try:
                                dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
                                new_record[field] = dt.isoformat()
                            except ValueError:
                                pass
            
            result.append(new_record)
        
        return result
    
    async def _transform_flatten(self, data: List[Dict], config: Dict) -> List[Dict]:
        """Flatten nested objects."""
        separator = config.get("separator", ".")
        result = []
        
        def flatten_dict(d: Dict, parent_key: str = '') -> Dict:
            items = []
            for k, v in d.items():
                new_key = f"{parent_key}{separator}{k}" if parent_key else k
                if isinstance(v, dict):
                    items.extend(flatten_dict(v, new_key).items())
                else:
                    items.append((new_key, v))
            return dict(items)
        
        for record in data:
            result.append(flatten_dict(record))
        
        return result
    
    async def _transform_deduplicate(self, data: List[Dict], config: Dict) -> List[Dict]:
        """Remove duplicate records."""
        key_fields = config.get("key_fields", [])
        keep = config.get("keep", "first")  # first/last
        
        if not key_fields:
            # Dedupe by entire record
            seen = set()
            result = []
            for record in data:
                record_hash = hashlib.md5(
                    json.dumps(record, sort_keys=True, default=str).encode()
                ).hexdigest()
                if record_hash not in seen:
                    seen.add(record_hash)
                    result.append(record)
            return result
        
        # Dedupe by key fields
        seen = {}
        for i, record in enumerate(data):
            key = tuple(record.get(f) for f in key_fields)
            if key not in seen:
                seen[key] = i
            elif keep == "last":
                seen[key] = i
        
        return [data[i] for i in sorted(seen.values())]
    
    async def _transform_sort(self, data: List[Dict], config: Dict) -> List[Dict]:
        """Sort records."""
        sort_fields = config.get("fields", [])
        
        def sort_key(record: Dict):
            return tuple(
                (record.get(f["field"]), f.get("order", "asc"))
                for f in sort_fields
            )
        
        reverse = any(f.get("order") == "desc" for f in sort_fields)
        return sorted(data, key=lambda r: tuple(r.get(f["field"]) for f in sort_fields), reverse=reverse)
    
    async def _transform_mask(self, data: List[Dict], config: Dict) -> List[Dict]:
        """Mask sensitive fields."""
        mask_fields = config.get("fields", [])
        mask_char = config.get("mask_char", "*")
        
        result = []
        for record in data:
            new_record = dict(record)
            for field_config in mask_fields:
                field = field_config.get("field")
                mask_type = field_config.get("type", "full")
                
                if field in new_record and new_record[field]:
                    value = str(new_record[field])
                    
                    if mask_type == "full":
                        new_record[field] = mask_char * len(value)
                    elif mask_type == "partial":
                        # Show first and last char
                        if len(value) > 2:
                            new_record[field] = value[0] + mask_char * (len(value) - 2) + value[-1]
                        else:
                            new_record[field] = mask_char * len(value)
                    elif mask_type == "email":
                        # Mask email keeping domain
                        if "@" in value:
                            parts = value.split("@")
                            masked_local = parts[0][0] + mask_char * (len(parts[0]) - 1)
                            new_record[field] = f"{masked_local}@{parts[1]}"
                    elif mask_type == "phone":
                        # Show last 4 digits
                        if len(value) > 4:
                            new_record[field] = mask_char * (len(value) - 4) + value[-4:]
            
            result.append(new_record)
        
        return result
    
    async def _transform_merge(self, data: List[Dict], config: Dict) -> List[Dict]:
        """Merge records with additional data."""
        merge_data = config.get("merge_data", [])
        join_field = config.get("join_field")
        
        if not join_field or not merge_data:
            return data
        
        # Create lookup
        lookup = {r.get(join_field): r for r in merge_data}
        
        result = []
        for record in data:
            new_record = dict(record)
            join_value = record.get(join_field)
            if join_value in lookup:
                new_record.update(lookup[join_value])
            result.append(new_record)
        
        return result
    
    async def _transform_aggregate(self, data: List[Dict], config: Dict) -> List[Dict]:
        """Aggregate records."""
        group_by = config.get("group_by", [])
        aggregations = config.get("aggregations", [])
        
        if not group_by:
            # Single aggregate
            agg_result = {}
            for agg in aggregations:
                field = agg.get("field")
                func = agg.get("function")
                alias = agg.get("alias", f"{field}_{func}")
                
                values = [r.get(field) for r in data if r.get(field) is not None]
                
                if func == "count":
                    agg_result[alias] = len(values)
                elif func == "sum":
                    agg_result[alias] = sum(values)
                elif func == "avg":
                    agg_result[alias] = sum(values) / len(values) if values else 0
                elif func == "min":
                    agg_result[alias] = min(values) if values else None
                elif func == "max":
                    agg_result[alias] = max(values) if values else None
            
            return [agg_result]
        
        # Group by
        groups = {}
        for record in data:
            key = tuple(record.get(f) for f in group_by)
            if key not in groups:
                groups[key] = []
            groups[key].append(record)
        
        result = []
        for key, records in groups.items():
            row = dict(zip(group_by, key))
            
            for agg in aggregations:
                field = agg.get("field")
                func = agg.get("function")
                alias = agg.get("alias", f"{field}_{func}")
                
                values = [r.get(field) for r in records if r.get(field) is not None]
                
                if func == "count":
                    row[alias] = len(values)
                elif func == "sum":
                    row[alias] = sum(values)
                elif func == "avg":
                    row[alias] = sum(values) / len(values) if values else 0
                elif func == "min":
                    row[alias] = min(values) if values else None
                elif func == "max":
                    row[alias] = max(values) if values else None
            
            result.append(row)
        
        return result


# =============================================================================
# DATA PROCESSING SERVICE
# =============================================================================

class DataProcessingService:
    """
    Data Processing Service - ETL operations for CHE·NU.
    
    Provides extraction, transformation, validation, and loading
    capabilities for data pipelines.
    """
    
    def __init__(self):
        # Storage
        self.jobs: Dict[str, ProcessingJob] = {}
        self.schemas: Dict[str, DataSchema] = {}
        
        # Components
        self.transformer = DataTransformer()
        self.validators: Dict[str, Validator] = {
            "string": StringValidator(),
            "number": NumberValidator(),
            "boolean": BooleanValidator(),
            "email": EmailValidator(),
            "date": DateValidator(),
            "array": ArrayValidator(),
        }
        
        logger.info("DataProcessingService initialized")
    
    # =========================================================================
    # SCHEMA MANAGEMENT
    # =========================================================================
    
    def create_schema(
        self,
        name: str,
        version: str,
        fields: List[Dict[str, Any]],
        description: Optional[str] = None,
    ) -> DataSchema:
        """Create a data schema."""
        schema_id = str(uuid4())
        
        schema_fields = [
            SchemaField(
                name=f["name"],
                field_type=f.get("type", "string"),
                required=f.get("required", False),
                nullable=f.get("nullable", True),
                min_length=f.get("min_length"),
                max_length=f.get("max_length"),
                min_value=f.get("min_value"),
                max_value=f.get("max_value"),
                pattern=f.get("pattern"),
                enum_values=f.get("enum"),
                default=f.get("default"),
                description=f.get("description"),
            )
            for f in fields
        ]
        
        schema = DataSchema(
            schema_id=schema_id,
            name=name,
            version=version,
            fields=schema_fields,
            description=description,
        )
        
        self.schemas[schema_id] = schema
        logger.info(f"Created schema: {name} v{version}")
        
        return schema
    
    def get_schema(self, schema_id: str) -> Optional[DataSchema]:
        """Get schema by ID."""
        return self.schemas.get(schema_id)
    
    def list_schemas(self) -> List[DataSchema]:
        """List all schemas."""
        return list(self.schemas.values())
    
    # =========================================================================
    # VALIDATION
    # =========================================================================
    
    def validate_data(
        self,
        data: List[Dict[str, Any]],
        schema_id: str,
        level: ValidationLevel = ValidationLevel.NORMAL,
    ) -> ValidationResult:
        """Validate data against a schema."""
        schema = self.schemas.get(schema_id)
        if not schema:
            return ValidationResult(
                status=ValidationStatus.INVALID,
                errors=[ValidationError(
                    field="_schema",
                    message=f"Schema {schema_id} not found",
                    value=None,
                    rule="schema_exists",
                )],
            )
        
        all_errors = []
        all_warnings = []
        
        for i, record in enumerate(data):
            for field in schema.fields:
                value = record.get(field.name)
                validator = self.validators.get(field.field_type, self.validators["string"])
                
                errors = validator.validate(value, field)
                
                for error in errors:
                    error.field = f"[{i}].{error.field}"
                    if level == ValidationLevel.LENIENT:
                        all_warnings.append(error)
                    else:
                        all_errors.append(error)
        
        if all_errors:
            status = ValidationStatus.INVALID
        elif all_warnings:
            status = ValidationStatus.WARNING
        else:
            status = ValidationStatus.VALID
        
        return ValidationResult(
            status=status,
            errors=all_errors,
            warnings=all_warnings,
            metadata={
                "schema_id": schema_id,
                "schema_name": schema.name,
                "record_count": len(data),
                "level": level.value,
            },
        )
    
    def validate_record(
        self,
        record: Dict[str, Any],
        schema_id: str,
    ) -> ValidationResult:
        """Validate a single record."""
        return self.validate_data([record], schema_id)
    
    # =========================================================================
    # TRANSFORMATION
    # =========================================================================
    
    async def transform(
        self,
        data: List[Dict[str, Any]],
        transformations: List[Dict[str, Any]],
    ) -> tuple[List[Dict[str, Any]], List[TransformationStep]]:
        """Apply transformations to data."""
        result = data
        steps = []
        
        for transform_config in transformations:
            step_id = str(uuid4())
            transform_type = TransformationType(transform_config.get("type", "map"))
            config = transform_config.get("config", {})
            
            step = TransformationStep(
                step_id=step_id,
                transformation_type=transform_type,
                config=config,
                input_data=result[:5] if len(result) > 5 else result,  # Sample
                started_at=datetime.utcnow(),
            )
            
            try:
                result = await self.transformer.transform(result, transform_type, config)
                step.output_data = result[:5] if len(result) > 5 else result  # Sample
                step.completed_at = datetime.utcnow()
            except Exception as e:
                step.error = str(e)
                step.completed_at = datetime.utcnow()
                raise
            
            steps.append(step)
        
        return result, steps
    
    # =========================================================================
    # ETL JOBS
    # =========================================================================
    
    async def create_job(
        self,
        source_type: DataSourceType,
        data: List[Dict[str, Any]],
        transformations: Optional[List[Dict[str, Any]]] = None,
        schema_id: Optional[str] = None,
        validation_level: ValidationLevel = ValidationLevel.NORMAL,
    ) -> ProcessingJob:
        """Create and execute a data processing job."""
        job_id = str(uuid4())
        
        job = ProcessingJob(
            job_id=job_id,
            source_type=source_type,
            status=ProcessingStatus.PENDING,
            created_at=datetime.utcnow(),
            input_records=len(data),
            metadata={
                "transformations_count": len(transformations) if transformations else 0,
                "schema_id": schema_id,
            },
        )
        
        self.jobs[job_id] = job
        
        try:
            # Start job
            job.status = ProcessingStatus.EXTRACTING
            job.started_at = datetime.utcnow()
            
            # Transform
            if transformations:
                job.status = ProcessingStatus.TRANSFORMING
                data, steps = await self.transform(data, transformations)
                job.transformation_steps = steps
            
            # Validate
            if schema_id:
                job.status = ProcessingStatus.VALIDATING
                validation = self.validate_data(data, schema_id, validation_level)
                job.validation_result = validation
                
                if validation.status == ValidationStatus.INVALID:
                    job.error_records = validation.error_count
            
            # Complete
            job.status = ProcessingStatus.COMPLETED
            job.output_records = len(data)
            job.completed_at = datetime.utcnow()
            
            logger.info(f"Job {job_id} completed: {job.input_records} in, {job.output_records} out")
            
        except Exception as e:
            job.status = ProcessingStatus.FAILED
            job.error = str(e)
            job.completed_at = datetime.utcnow()
            logger.error(f"Job {job_id} failed: {e}")
        
        return job
    
    def get_job(self, job_id: str) -> Optional[ProcessingJob]:
        """Get job by ID."""
        return self.jobs.get(job_id)
    
    def list_jobs(
        self,
        status: Optional[ProcessingStatus] = None,
        limit: int = 100,
    ) -> List[ProcessingJob]:
        """List jobs with optional filtering."""
        jobs = list(self.jobs.values())
        
        if status:
            jobs = [j for j in jobs if j.status == status]
        
        # Sort by created_at descending
        jobs.sort(key=lambda j: j.created_at, reverse=True)
        
        return jobs[:limit]
    
    # =========================================================================
    # UTILITY METHODS
    # =========================================================================
    
    def generate_sample_data(
        self,
        schema_id: str,
        count: int = 10,
    ) -> List[Dict[str, Any]]:
        """Generate sample data based on schema."""
        schema = self.schemas.get(schema_id)
        if not schema:
            raise ValueError(f"Schema {schema_id} not found")
        
        samples = []
        for i in range(count):
            record = {}
            for field in schema.fields:
                if field.default is not None:
                    record[field.name] = field.default
                elif field.field_type == "string":
                    record[field.name] = f"sample_{field.name}_{i}"
                elif field.field_type == "number":
                    record[field.name] = i * 100
                elif field.field_type == "boolean":
                    record[field.name] = i % 2 == 0
                elif field.field_type == "email":
                    record[field.name] = f"user{i}@example.com"
                elif field.field_type == "date":
                    record[field.name] = datetime.utcnow().isoformat()
                elif field.field_type == "array":
                    record[field.name] = []
                elif field.enum_values:
                    record[field.name] = field.enum_values[i % len(field.enum_values)]
                else:
                    record[field.name] = None
            samples.append(record)
        
        return samples
    
    def calculate_data_quality(
        self,
        data: List[Dict[str, Any]],
        schema_id: str,
    ) -> Dict[str, Any]:
        """Calculate data quality metrics."""
        schema = self.schemas.get(schema_id)
        if not schema:
            raise ValueError(f"Schema {schema_id} not found")
        
        total_records = len(data)
        if total_records == 0:
            return {"completeness": 0, "validity": 0, "fields": {}}
        
        field_metrics = {}
        
        for field in schema.fields:
            values = [r.get(field.name) for r in data]
            non_null = [v for v in values if v is not None]
            
            field_metrics[field.name] = {
                "completeness": len(non_null) / total_records,
                "null_count": total_records - len(non_null),
                "unique_count": len(set(str(v) for v in non_null)),
            }
        
        # Overall completeness
        total_fields = len(schema.fields) * total_records
        filled_fields = sum(
            sum(1 for r in data if r.get(f.name) is not None)
            for f in schema.fields
        )
        
        # Validity
        validation = self.validate_data(data, schema_id, ValidationLevel.LENIENT)
        valid_records = total_records - len(set(
            int(e.field.split('.')[0].strip('[]'))
            for e in validation.errors
        ))
        
        return {
            "total_records": total_records,
            "completeness": filled_fields / total_fields if total_fields > 0 else 0,
            "validity": valid_records / total_records,
            "error_count": validation.error_count,
            "warning_count": validation.warning_count,
            "fields": field_metrics,
        }


# =============================================================================
# SERVICE INSTANCE
# =============================================================================

data_processing_service = DataProcessingService()


# =============================================================================
# PREDEFINED SCHEMAS
# =============================================================================

# User schema
data_processing_service.create_schema(
    name="User",
    version="1.0",
    fields=[
        {"name": "id", "type": "string", "required": True},
        {"name": "email", "type": "email", "required": True},
        {"name": "name", "type": "string", "required": True, "min_length": 1, "max_length": 100},
        {"name": "created_at", "type": "date", "required": True},
        {"name": "active", "type": "boolean", "required": False, "default": True},
    ],
    description="User account schema",
)

# DataSpace schema
data_processing_service.create_schema(
    name="DataSpace",
    version="1.0",
    fields=[
        {"name": "id", "type": "string", "required": True},
        {"name": "name", "type": "string", "required": True, "min_length": 1, "max_length": 200},
        {"name": "owner_id", "type": "string", "required": True},
        {"name": "sphere", "type": "string", "required": True, "enum": [
            "personal", "business", "government", "creative", "community",
            "social", "entertainment", "my_team", "scholar"
        ]},
        {"name": "created_at", "type": "date", "required": True},
    ],
    description="DataSpace schema",
)

# Thread schema
data_processing_service.create_schema(
    name="Thread",
    version="1.0",
    fields=[
        {"name": "id", "type": "string", "required": True},
        {"name": "title", "type": "string", "required": True},
        {"name": "content", "type": "string", "required": False},
        {"name": "author_id", "type": "string", "required": True},
        {"name": "dataspace_id", "type": "string", "required": True},
        {"name": "status", "type": "string", "required": True, "enum": [
            "draft", "active", "archived", "deleted"
        ]},
        {"name": "created_at", "type": "date", "required": True},
        {"name": "tags", "type": "array", "required": False},
    ],
    description="Thread schema",
)


# =============================================================================
# EXPORTS
# =============================================================================

__all__ = [
    # Service
    "DataProcessingService",
    "data_processing_service",
    # Enums
    "DataSourceType",
    "TransformationType",
    "ValidationLevel",
    "ValidationStatus",
    "ProcessingStatus",
    # Data classes
    "ValidationError",
    "ValidationResult",
    "TransformationStep",
    "ProcessingJob",
    "SchemaField",
    "DataSchema",
    # Components
    "DataTransformer",
    "Validator",
    "StringValidator",
    "NumberValidator",
    "BooleanValidator",
    "EmailValidator",
    "DateValidator",
    "ArrayValidator",
]
