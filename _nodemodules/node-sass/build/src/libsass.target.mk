# This file is generated by gyp; do not edit.

TOOLSET := target
TARGET := libsass
DEFS_Debug := \
	'-DNODE_GYP_MODULE_NAME=libsass' \
	'-DUSING_UV_SHARED=1' \
	'-DUSING_V8_SHARED=1' \
	'-DV8_DEPRECATION_WARNINGS=1' \
	'-D_DARWIN_USE_64_BIT_INODE=1' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-DLIBSASS_VERSION="3.5.0.beta.2"' \
	'-D_DEBUG' \
	'-DV8_ENABLE_CHECKS'

# Flags passed to all source files.
CFLAGS_Debug := \
	-O0 \
	-gdwarf-2 \
	-mmacosx-version-min=10.7 \
	-arch x86_64 \
	-Wall \
	-Wendif-labels \
	-W \
	-Wno-unused-parameter

# Flags passed to only C files.
CFLAGS_C_Debug := \
	-fno-strict-aliasing

# Flags passed to only C++ files.
CFLAGS_CC_Debug := \
	-std=c++11 \
	-stdlib=libc++ \
	-fno-threadsafe-statics \
	-fno-strict-aliasing

# Flags passed to only ObjC files.
CFLAGS_OBJC_Debug :=

# Flags passed to only ObjC++ files.
CFLAGS_OBJCC_Debug :=

INCS_Debug := \
	-I/Users/annikawestphaling/.node-gyp/8.1.0/include/node \
	-I/Users/annikawestphaling/.node-gyp/8.1.0/src \
	-I/Users/annikawestphaling/.node-gyp/8.1.0/deps/uv/include \
	-I/Users/annikawestphaling/.node-gyp/8.1.0/deps/v8/include \
	-I$(srcdir)/src/libsass/include

DEFS_Release := \
	'-DNODE_GYP_MODULE_NAME=libsass' \
	'-DUSING_UV_SHARED=1' \
	'-DUSING_V8_SHARED=1' \
	'-DV8_DEPRECATION_WARNINGS=1' \
	'-D_DARWIN_USE_64_BIT_INODE=1' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-DLIBSASS_VERSION="3.5.0.beta.2"'

# Flags passed to all source files.
CFLAGS_Release := \
	-Os \
	-gdwarf-2 \
	-mmacosx-version-min=10.7 \
	-arch x86_64 \
	-Wall \
	-Wendif-labels \
	-W \
	-Wno-unused-parameter

# Flags passed to only C files.
CFLAGS_C_Release := \
	-fno-strict-aliasing

# Flags passed to only C++ files.
CFLAGS_CC_Release := \
	-std=c++11 \
	-stdlib=libc++ \
	-fno-threadsafe-statics \
	-fno-strict-aliasing

# Flags passed to only ObjC files.
CFLAGS_OBJC_Release :=

# Flags passed to only ObjC++ files.
CFLAGS_OBJCC_Release :=

INCS_Release := \
	-I/Users/annikawestphaling/.node-gyp/8.1.0/include/node \
	-I/Users/annikawestphaling/.node-gyp/8.1.0/src \
	-I/Users/annikawestphaling/.node-gyp/8.1.0/deps/uv/include \
	-I/Users/annikawestphaling/.node-gyp/8.1.0/deps/v8/include \
	-I$(srcdir)/src/libsass/include

OBJS := \
	$(obj).target/$(TARGET)/src/libsass/src/ast.o \
	$(obj).target/$(TARGET)/src/libsass/src/ast_fwd_decl.o \
	$(obj).target/$(TARGET)/src/libsass/src/base64vlq.o \
	$(obj).target/$(TARGET)/src/libsass/src/bind.o \
	$(obj).target/$(TARGET)/src/libsass/src/cencode.o \
	$(obj).target/$(TARGET)/src/libsass/src/check_nesting.o \
	$(obj).target/$(TARGET)/src/libsass/src/color_maps.o \
	$(obj).target/$(TARGET)/src/libsass/src/constants.o \
	$(obj).target/$(TARGET)/src/libsass/src/context.o \
	$(obj).target/$(TARGET)/src/libsass/src/cssize.o \
	$(obj).target/$(TARGET)/src/libsass/src/emitter.o \
	$(obj).target/$(TARGET)/src/libsass/src/environment.o \
	$(obj).target/$(TARGET)/src/libsass/src/error_handling.o \
	$(obj).target/$(TARGET)/src/libsass/src/eval.o \
	$(obj).target/$(TARGET)/src/libsass/src/expand.o \
	$(obj).target/$(TARGET)/src/libsass/src/extend.o \
	$(obj).target/$(TARGET)/src/libsass/src/file.o \
	$(obj).target/$(TARGET)/src/libsass/src/functions.o \
	$(obj).target/$(TARGET)/src/libsass/src/inspect.o \
	$(obj).target/$(TARGET)/src/libsass/src/json.o \
	$(obj).target/$(TARGET)/src/libsass/src/lexer.o \
	$(obj).target/$(TARGET)/src/libsass/src/listize.o \
	$(obj).target/$(TARGET)/src/libsass/src/memory/SharedPtr.o \
	$(obj).target/$(TARGET)/src/libsass/src/node.o \
	$(obj).target/$(TARGET)/src/libsass/src/output.o \
	$(obj).target/$(TARGET)/src/libsass/src/parser.o \
	$(obj).target/$(TARGET)/src/libsass/src/plugins.o \
	$(obj).target/$(TARGET)/src/libsass/src/position.o \
	$(obj).target/$(TARGET)/src/libsass/src/prelexer.o \
	$(obj).target/$(TARGET)/src/libsass/src/remove_placeholders.o \
	$(obj).target/$(TARGET)/src/libsass/src/sass.o \
	$(obj).target/$(TARGET)/src/libsass/src/sass2scss.o \
	$(obj).target/$(TARGET)/src/libsass/src/sass_context.o \
	$(obj).target/$(TARGET)/src/libsass/src/sass_functions.o \
	$(obj).target/$(TARGET)/src/libsass/src/sass_util.o \
	$(obj).target/$(TARGET)/src/libsass/src/sass_values.o \
	$(obj).target/$(TARGET)/src/libsass/src/source_map.o \
	$(obj).target/$(TARGET)/src/libsass/src/subset_map.o \
	$(obj).target/$(TARGET)/src/libsass/src/to_c.o \
	$(obj).target/$(TARGET)/src/libsass/src/to_value.o \
	$(obj).target/$(TARGET)/src/libsass/src/units.o \
	$(obj).target/$(TARGET)/src/libsass/src/utf8_string.o \
	$(obj).target/$(TARGET)/src/libsass/src/util.o \
	$(obj).target/$(TARGET)/src/libsass/src/values.o

# Add to the list of files we specially track dependencies for.
all_deps += $(OBJS)

# CFLAGS et al overrides must be target-local.
# See "Target-specific Variable Values" in the GNU Make manual.
$(OBJS): TOOLSET := $(TOOLSET)
$(OBJS): GYP_CFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_C_$(BUILDTYPE))
$(OBJS): GYP_CXXFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_CC_$(BUILDTYPE))
$(OBJS): GYP_OBJCFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_C_$(BUILDTYPE)) $(CFLAGS_OBJC_$(BUILDTYPE))
$(OBJS): GYP_OBJCXXFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_CC_$(BUILDTYPE)) $(CFLAGS_OBJCC_$(BUILDTYPE))

# Suffix rules, putting all outputs into $(obj).

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(srcdir)/%.c FORCE_DO_CMD
	@$(call do_cmd,cc,1)

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(srcdir)/%.cpp FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# Try building from generated source, too.

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj).$(TOOLSET)/%.c FORCE_DO_CMD
	@$(call do_cmd,cc,1)

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj).$(TOOLSET)/%.cpp FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj)/%.c FORCE_DO_CMD
	@$(call do_cmd,cc,1)

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj)/%.cpp FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# End of this set of suffix rules
### Rules for final target.
LDFLAGS_Debug := \
	-mmacosx-version-min=10.7 \
	-arch x86_64 \
	-L$(builddir) \
	-stdlib=libc++

LIBTOOLFLAGS_Debug :=

LDFLAGS_Release := \
	-mmacosx-version-min=10.7 \
	-arch x86_64 \
	-L$(builddir) \
	-stdlib=libc++

LIBTOOLFLAGS_Release :=

LIBS :=

$(builddir)/sass.a: GYP_LDFLAGS := $(LDFLAGS_$(BUILDTYPE))
$(builddir)/sass.a: LIBS := $(LIBS)
$(builddir)/sass.a: GYP_LIBTOOLFLAGS := $(LIBTOOLFLAGS_$(BUILDTYPE))
$(builddir)/sass.a: TOOLSET := $(TOOLSET)
$(builddir)/sass.a: $(OBJS) FORCE_DO_CMD
	$(call do_cmd,alink)

all_deps += $(builddir)/sass.a
# Add target alias
.PHONY: libsass
libsass: $(builddir)/sass.a

# Add target alias to "all" target.
.PHONY: all
all: libsass

# Add target alias
.PHONY: libsass
libsass: $(builddir)/sass.a

# Short alias for building this static library.
.PHONY: sass.a
sass.a: $(builddir)/sass.a

# Add static library to "all" target.
.PHONY: all
all: $(builddir)/sass.a

